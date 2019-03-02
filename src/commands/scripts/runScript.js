const chalk = require('chalk')
const {exec} = require('shelljs')

module.exports = (project, eventName) => {
  if (!('scripts' in project && project.scripts && eventName in project.scripts && project.scripts[eventName])) {
    return
  }

  let scripts = project.scripts[eventName]
  if (typeof scripts !== 'object') {
    scripts = [scripts]
  }

  for (const script of scripts) {
    const opts = {
      silent: true,
      async: true
    }

    console.log(chalk.dim('Executing "' + script + '"'))

    const process = exec(script, opts)
    process.on('exit', function (code) {
      code = parseInt(code, 10) || code
      console.log(chalk[code === 0 ? 'dim' : 'red']('Exited with code ' + code))
    })

    process.stderr.on('data', function (message) {
      console.log(chalk.red(message))
    })
    process.stdout.on('data', function (message) {
      console.log(chalk.dim(message))
    })
  }
}
