const {exec} = require('shelljs')

module.exports = () => {
  exec('docker-compose down')
}
