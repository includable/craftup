module.exports = (program) => {
  program
    .command('init <name>')
    .description('Create a new project')
    .action((name) => require('./init')(name))

  program
    .command('start')
    .description('Run project locally')
    .option('-s --silent', 'Don\'t open in web browser')
    .action((silent) => require('./start')(silent))
}
