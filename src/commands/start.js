const ora = require("ora");
const axios = require("axios");
const chalk = require("chalk");
const { exec } = require("shelljs");
const logUpdate = require("log-update");

const loadProject = require("./scripts/loadProject");
const openInBrowser = require("./scripts/openInBrowser");
const ensureDocker = require("./scripts/ensureDocker");
const runScript = require("./scripts/runScript");
const startDocker = require("./scripts/startDocker");

let child;

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

module.exports = () => {
  // Check requirements
  ensureDocker();

  // Load project meta
  const project = loadProject();
  let started = false;

  console.log("Starting Docker container...");

  const child = startDocker();
  child.stdout.on("data", (data) => {
    console.log(data.trim());
  });

  // Open browser when ready
  let tries = 0;
  const checkStarted = () => {
    axios
      .get(`http://localhost:${project.port}/admin/login`, {
        timeout: 1000,
        headers: { "User-Agent": "craftup/1.0.0" },
        validateStatus: () => true,
      })
      .then(() => {
        openInBrowser(project.port);
        setTimeout(() => {
          console.log("");
          started = true;
          runScript(project, "start");
        }, 1000);
      })
      .catch(() => {
        setTimeout(() => checkStarted(), 1000);
        tries++;
        if (tries > 200) {
          console.log(chalk.red.bold("Could not start docker container..."));
          child.kill();
          process.exit(1);
        }
      });
  };

  checkStarted();
};
