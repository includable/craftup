const ora = require('ora')
const axios = require('axios')
const chalk = require('chalk')
const {exec} = require('shelljs')

const loadProject = require('./scripts/loadProject')
const openInBrowser = require('./scripts/openInBrowser')
const ensureDocker = require('./scripts/ensureDocker')

let child

const cleanup = () => {
  if (child) {
    console.log('')
    const spinner = ora('Stopping server').start()
    child.kill('SIGINT')
    exec('docker-compose stop', {silent: true})
    spinner.stop()
  }
  process.exit()
}

process.on('SIGINT', cleanup)

module.exports = () => {
  // Check requirements
  ensureDocker()

  // Load project meta
  const project = loadProject()
  let started = false
  let spinner = ora('Starting local development server').start()

  // Start docker-compose
  child = exec('docker-compose up --abort-on-container-exit --exit-code-from web', {
    silent: true
  }, (code, stdout, stderr) => {
    console.log(stdout)
    console.log(chalk.red(stderr))
    process.exit(code)
  })
  child.stdout.on('data', (data) => {
    if (started) {
      console.log(data.trim())
    }
  })

  // Open browser when ready
  let tries = 0
  const checkStarted = () => {
    axios
      .get(`http://localhost:${project.port}/admin/login`, {
        timeout: 1000,
        headers: {'User-Agent': 'craftup/1.0.0'}
      })
      .then(() => {
        openInBrowser(project.port)
        setTimeout(() => {
          console.log('')
          started = true
        }, 3000)
        spinner.succeed()
      })
      .catch(() => {
        setTimeout(() => checkStarted(), 2000)
        tries++
        if (tries > 50) {
          spinner.fail()
          console.log(chalk.red.bold('Could not start docker container...'))
          child.kill()
          process.exit(1)
        }
      })
  }

  checkStarted()
}
