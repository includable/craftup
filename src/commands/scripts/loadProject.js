const chalk = require('chalk')
const yaml = require('yaml')
const path = require('path')
const fs = require('fs')

module.exports = () => {
  const filename = path.join('config', 'craftup.yaml')
  if (!fs.existsSync(filename)) {
    console.log(chalk.red(`Could not find craftup.json`))
    console.log('Make sure to only run this command in a directory created via ' +
      chalk.yellow.bold('craftup init') + '.')
    process.exit(1)
  }

  const content = fs.readFileSync(filename, 'utf8')
  return yaml.parse(content)
}
