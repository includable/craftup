module.exports = (program) => {
  program
    .command('init <name>')
    .description('Create a new project')
    .action((name) => require('./init')(name))
}
