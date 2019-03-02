const chalk = require('chalk')
const {exec} = require('shelljs')

const prefixed = (eventName, value, negative = false) => {
  value = value.split('\n')
  for (let line of value) {
    line = line.trim()
    if (!line.length) {
      continue
    }
    if (negative) {
      line = chalk.red(line)
    }
    console.log(chalk.blue('script_' + eventName + ' | ') + line)
  }
}

module.exports = (project, eventName) => {
  if (!('scripts' in project && project.scripts && eventName in project.scripts && project.scripts[eventName])) {
    return
  }

  let scripts = project.scripts[eventName]
  if (typeof scripts !== 'object') {
    scripts = [scripts]
  }

  let index = 0
  for (const script of scripts) {
    setTimeout(() => {
      const opts = {
        silent: true,
        async: true
      }

      prefixed(eventName, chalk.dim('Executing "' + script + '"'))

      const process = exec(script, opts)
      process.on('exit', function (code) {
        code = parseInt(code, 10) || code
        prefixed(eventName, 'Exited with code ' + code, code > 0)
      })

      process.stderr.on('data', function (message) {
        prefixed(eventName, message, true)
      })
      process.stdout.on('data', function (message) {
        prefixed(eventName, message)
      })
    }, (index++) * 100)
  }
}
