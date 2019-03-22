const ora = require('ora')
const {exec} = require('shelljs')
const mysqlimport = require('mysql-import')
const tcpPortUsed = require('tcp-port-used')
const Confirm = require('prompt-confirm')

const loadProject = require('./scripts/loadProject')
const ensureDocker = require('./scripts/ensureDocker')
const startDocker = require('./scripts/startDocker')

let child

const bootDocker = (project, filename, spinner) => {
  child = startDocker()

  tcpPortUsed.waitUntilUsed(project.port + 10, 1000, 30000)
    .then(() => {
      setTimeout(() => {
        spinner.succeed()
        doLoad(project, filename)
      }, 2000)
    })
    .catch(() => {
      spinner.fail()
      console.log('Sorry, could not connect to your MySQL instance running in docker.')
      cleanup()
    })
}

const doLoad = (project, filename) => {
  // Ask user if they want to overwrite database
  const prompt = new Confirm('Are you sure you want overwrite your local database?')
  prompt.ask(function (answer) {
    if (answer) {
      return doActualLoad(project, filename)
    }
    cleanup()
  })
}

const doActualLoad = (project, filename) => {
  const cleanName = project.name.replace(/-/g, '_')

  const importer = mysqlimport.config({
    host: `127.0.0.1`,
    user: 'root',
    password: 'root',
    port: project.port + 10,
    database: `craft_${cleanName}`
  })

  importer.import(filename)
    .then(() => {
      console.log('Done!')
      cleanup()
    }).catch((e) => {
    console.error(e)
    cleanup()
  })
}

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

module.exports = (filename) => {
  // Filename
  filename = filename || 'database.sql'

  // Check requirements
  ensureDocker()

  // Load project meta
  const project = loadProject()
  let spinner = ora('Loading local database').start()

  // Start docker if required
  tcpPortUsed.check(project.port + 10)
    .then((inUse) => {
      if (inUse) {
        spinner.succeed()
        doLoad(project, filename)
      } else {
        bootDocker(project, filename, spinner)
      }
    })
    .catch(() => {
      bootDocker(project, filename, spinner)
    })
}
