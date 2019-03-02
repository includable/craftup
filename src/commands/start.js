const ora = require('ora')
const axios = require('axios')
const chalk = require('chalk')
const {exec} = require('shelljs')

const loadProject = require('./scripts/loadProject')
const openInBrowser = require('./scripts/openInBrowser')
const ensureDocker = require('./scripts/ensureDocker')

module.exports = () => {
  // Check requirements
  ensureDocker()

  // Load project meta
  const project = loadProject()
  let started = false
  let spinner = ora('Starting local server').start()

  // Start docker-compose
  const child = exec('docker-compose up --exit-code-from web', {
    silent: true
  }, (code, stdout, stderr) => {
    console.log(chalk.red(stdout))
    console.log(chalk.red(stderr))
    process.exit(code)
  })
  child.stdout.on('data', (data) => {
    if (started) {
      console.log(data)
    }
  })

  // Open browser when ready
  const checkStarted = () => {
    axios
      .get('http://localhost:' + project.port + '/admin', {timeout: 1000})
      .then(() => {
        openInBrowser(project.port)
        setTimeout(() => {
          console.log('')
          started = true
        }, 3000)
        spinner.succeed()
      })
      .catch((e) => {
        setTimeout(() => checkStarted(), 2000)
        console.log(e)
      })
  }

  checkStarted()
}
