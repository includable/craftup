const fs = require("fs");
const ora = require("ora");
const { exec } = require("shelljs");
const mysqldump = require("mysqldump");
const tcpPortUsed = require("tcp-port-used");
const Confirm = require("prompt-confirm");

const loadProject = require("./scripts/loadProject");
const ensureDocker = require("./scripts/ensureDocker");
const startDocker = require("./scripts/startDocker");

let child;

const bootDocker = (project, filename, spinner) => {
  child = startDocker();

  tcpPortUsed
    .waitUntilUsed(project.port + 10, 1000, 30000)
    .then(() => {
      setTimeout(() => {
        spinner.succeed();
        doDump(project, filename);
      }, 2000);
    })
    .catch(() => {
      spinner.fail();
      console.log(
        "Sorry, could not connect to your MySQL instance running in docker."
      );
      cleanup();
    });
};

const doDump = (project, filename) => {
  if (!fs.existsSync(filename)) {
    return doActualDump(project, filename);
  }

  // Ask user if they want to overwrite file
  const prompt = new Confirm(
    "File exists. Are you sure you want overwrite " + filename + "?"
  );
  prompt.ask(function (answer) {
    if (answer) {
      return doActualDump(project, filename);
    }
    cleanup();
  });
};

const doActualDump = (project, filename) => {
  const cleanName = project.name.replace(/-/g, "_");

  mysqldump({
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "root",
      port: project.port + 10,
      database: `craft_${cleanName}`,
    },
    dump: {
      schema: {
        table: {
          dropIfExist: true,
        },
      },
    },
    dumpToFile: filename,
  })
    .then(() => {
      console.log("Done!");
      cleanup();
    })
    .catch((e) => {
      console.error(e);
      cleanup();
    });
};

const cleanup = () => {
  if (child) {
    console.log("");
    const spinner = ora("Stopping server").start();
    child.kill("SIGINT");
    exec("docker-compose stop", { silent: true });
    spinner.stop();
  }
  process.exit();
};

process.on("SIGINT", cleanup);

module.exports = (filename) => {
  // Filename
  filename = filename || "database.sql";

  // Check requirements
  ensureDocker();

  // Load project meta
  const project = loadProject();
  let spinner = ora("Loading local database").start();

  // Start docker if required
  tcpPortUsed
    .check(project.port + 10)
    .then((inUse) => {
      if (inUse) {
        spinner.succeed();
        doDump(project, filename);
      } else {
        bootDocker(project, filename, spinner);
      }
    })
    .catch(() => {
      bootDocker(project, filename, spinner);
    });
};
