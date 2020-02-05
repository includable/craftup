const program = require('commander')
const updateNotifier = require('update-notifier')

const commands = require('./commands')
const pkg = require('../package.json')

// Check for updates
updateNotifier({ pkg }).notify()

// Load commands
commands(program)

// Execute program
program
  .version('craftup ' + pkg.version, '-v, --version')
  .parse(process.argv)

let called = false
program.on('command', () => {
  called = true
})

if (process.argv.length === 2) {
  program.help()
  process.exit(1)
}
