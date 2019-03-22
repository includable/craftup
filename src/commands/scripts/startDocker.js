const {exec} = require('shelljs')
const chalk = require('chalk')

module.exports = () => {
  return exec('docker-compose up --abort-on-container-exit --exit-code-from web', {
    silent: true
  }, (code, stdout, stderr) => {
    console.log(stdout)
    console.log(chalk.red(stderr))
    process.exit(code)
  })
}
