const path = require('path')
const mkdirp = require('mkdirp')
const unzip = require('unzip')
const fs = require('fs')
const hasbin = require('hasbin')
const uuid = require('uuid/v4')
const child = require('child_process')
const chalk = require('chalk')

const createCraftupJson = require('./scripts/createCraftupJson')
const createDockerCompose = require('./scripts/createDockerCompose')

module.exports = (name) => {
  // Check requirements
  if (!hasbin.sync('docker-compose')) {
    console.log(chalk.red('Docker should be installed and running'))
    console.log('Download Docker for Mac: https://hub.docker.com/editions/community/docker-ce-desktop-mac')
  }

  // Check name
  name = name.toLowerCase().trim()
  if (name.length > 20 || name.length < 1 || !name.match(/^[a-z0-9-_]+$/)) {
    console.log(chalk.red(
      `Name of your new project should consist out of lowercase a-z, 0-9, dashes and ` +
      `underscores, and be no more than 20 characters long.`
    ))
    process.exit(1)
  }

  // Create directory
  const baseDir = path.resolve(process.cwd())
  const targetDir = path.join(baseDir, name)
  if (fs.existsSync(targetDir)) {
    console.log(chalk.red(`Directory '${name} already exists'`))
    console.log('Please choose a name of a non-existing directory for your new project.')
    process.exit(1)
  }
  try {
    mkdirp.sync(targetDir)
  } catch (err) {
    console.log(chalk.red('Error creating directory'))
    console.log(err)
    process.exit(1)
  }

  // Unzip template
  fs.createReadStream(path.join(__dirname, '..', '..', 'dist', 'template.zip'))
    .pipe(unzip.Extract({path: targetDir}))
    .on('error', function (err) {
      console.log(chalk.red('Error extracting template directory'))
      console.log(err)
      process.exit(1)
    })
    .on('close', () => {
      setTimeout(() => {
        // Create default files
        const securityKey = uuid()
        const port = 3000 + Math.round(Math.random() * 4000)
        createCraftupJson(name, securityKey, port, targetDir)
        createDockerCompose(name, securityKey, port, targetDir)

        // Create git repo
        child.exec('cd "' + name + '" && git init && chmod -R 777 storage', () => {

          // Output text
          console.log(`
   ✨ ${chalk.bold.green(`Done creating your new Craft CMS project!`)}
   
   First execute ${chalk.bold.yellow('cd ' + name)} to enter the directory of the new site.
   After doing that, you can run any of the following commands:
   
       ${chalk.bold.yellow('craftup start')}     ${chalk.dim('start the local development server')}
       
       ${chalk.bold.yellow('craftup editor')}    ${chalk.dim('to open the site in your editor')}
       
       ${chalk.bold.yellow('craftup push')}      ${chalk.dim('to upload the files and database')}
       ${chalk.bold.yellow('craftup pull')}      ${chalk.dim('to pull the production database')}
`)
        })
      }, 300)
    })
}
