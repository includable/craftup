const ora = require('ora')
const axios = require('axios')
const chalk = require('chalk')
const { exec } = require('shelljs')
const logUpdate = require('log-update')

const loadProject = require('./scripts/loadProject')
const openInBrowser = require('./scripts/openInBrowser')
const ensureDocker = require('./scripts/ensureDocker')
const runScript = require('./scripts/runScript')
const startDocker = require('./scripts/startDocker')

let child

const cleanup = () => {
  if (child) {
    console.log('')
    const spinner = ora('Stopping server').start()
    child.kill('SIGINT')
    exec('docker-compose stop', { silent: true })
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
  let spinner = ora('Starting local development server')
  let logLines = ''

  const int = setInterval(() => logUpdate(logLines + '\n' + spinner.frame()), 100)

  const child = startDocker()
  child.stdout.on('data', (data) => {
    if (started) {
      console.log(data.trim())
    } else {
      logLines += data.trim() + '\n'
    }
  })

  // Open browser when ready
  let tries = 0
  const checkStarted = () => {
    axios
      .get(`http://localhost:${project.port}/admin/login`, {
        timeout: 1000,
        headers: { 'User-Agent': 'craftup/1.0.0' }
      })
      .then(() => {
        logUpdate(logLines)
        clearInterval(int)
        spinner.succeed()
        openInBrowser(project.port)
        setTimeout(() => {
          console.log('')
          started = true
          runScript(project, 'start')
        }, 3000)
      })
      .catch(() => {
        setTimeout(() => checkStarted(), 2000)
        tries++
        if (tries > 150) {
          logUpdate(logLines)
          clearInterval(int)
          spinner.fail()
          console.log(chalk.red.bold('Could not start docker container...'))
          child.kill()
          process.exit(1)
        }
      })
  }

  checkStarted()
}
