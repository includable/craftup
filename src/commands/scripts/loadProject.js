const chalk = require('chalk')
const fs = require('fs')

module.exports = () => {
  if (!fs.existsSync('craftup.json')) {
    console.log(chalk.red(`Could not find craftup.json`))
    console.log('Make sure to only run this command in a directory created via ' +
      chalk.yellow.bold('craftup init') + '.')
    process.exit(1)
  }

  const json = fs.readFileSync('craftup.json', 'utf8')
  return JSON.parse(json)
}
