module.exports = (program) => {
  program
    .command("init <name>")
    .description("Create a new project")
    .action((name) => require("./init")(name));

  program
    .command("start")
    .description("Run project locally")
    .action(() => require("./start")());

  program
    .command("clean")
    .description("Clean up local environment")
    .action(() => require("./clean")());

  program
    .command("editor")
    .description("Open the project in your default editor")
    .action(() => require("./editor")());

  program
    .command("dump [filename]")
    .description("Export the database to a file")
    .action((filename) => require("./dump")(filename));

  program
    .command("load [filename]")
    .description("Import the database from a file")
    .action((filename) => require("./load")(filename));

  program
    .command("pull [server]")
    .option("-y, --yes", "force continue")
    .description("Import the database from the server")
    .action((server, command) => require("./pull")(server, command));

  program
    .command("composer <package>")
    .description("Install a Composer package")
    .action((pkg) => require("./composer")(pkg));

  program.on("command:*", () => {
    console.error(
      "Invalid command: %s\nSee --help for a list of available commands.",
      program.args.join(" ")
    );
    process.exit(1);
  });
};
