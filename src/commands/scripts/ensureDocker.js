const hasbin = require('hasbin')
const chalk = require('chalk')

module.exports = () => {
  if (!hasbin.sync('docker-compose')) {
    console.log(chalk.red('Docker should be installed and running'))
    console.log('Download Docker for Mac: https://download.docker.com/mac/stable/Docker.dmg')
    process.exit(1)
  }
}
