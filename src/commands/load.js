const ora = require("ora");
const tcpPortUsed = require("tcp-port-used");

const loadProject = require("./scripts/loadProject");
const ensureDocker = require("./scripts/ensureDocker");

const { bootDocker, doLoad } = require("./scripts/localDatabase");

module.exports = async (filename, force) => {
  // Filename
  filename = filename || "database.sql";

  // Check requirements
  ensureDocker();

  // Load project meta
  const project = loadProject();
  let spinner = ora("Loading local database").start();

  // Start docker if required
  try {
    const inUse = await tcpPortUsed.check(project.port + 10);
    if (inUse) {
      spinner.stop();
    } else {
      await bootDocker(project, filename, spinner, force);
    }
  } catch (e) {
    await bootDocker(project, filename, spinner, force);
  }

  await doLoad(project, filename, force);

  process.exit(0);
};
