const mysqlimport = require("mysql-import");
const tcpPortUsed = require("tcp-port-used");
const ora = require("ora");

const startDocker = require("./startDocker");
const { confirm } = require("../../utils/output");

const sleep = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

const bootDocker = async (project, filename, spinner) => {
  startDocker();

  try {
    await tcpPortUsed.waitUntilUsed(project.port + 10, 1000, 30000);
    await sleep(2000);
  } catch (e) {
    spinner.fail();
    console.log(
      "Sorry, could not connect to your MySQL instance running in docker."
    );
    process.exit(1);
  }
};

const doLoad = async (project, filename, force) => {
  // Ask user if they want to overwrite database
  if (!force) {
    if (
      !(await confirm("Are you sure you want overwrite your local database?"))
    ) {
      process.exit(1);
    }
  }

  return doActualLoad(project, filename);
};

const doActualLoad = async (project, filename) => {
  const spinner = ora("Importing database").start();
  const cleanName = project.name.replace(/-/g, "_");

  const importer = mysqlimport.config({
    host: `127.0.0.1`,
    user: "root",
    password: "root",
    port: project.port + 10,
    database: `craft_${cleanName}`,
  });

  await importer.import(filename);

  spinner.succeed();
};

module.exports = {
  bootDocker,
  doLoad,
  doActualLoad,
};
