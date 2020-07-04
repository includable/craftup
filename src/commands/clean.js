const { exec } = require("shelljs");
const Confirm = require("prompt-confirm");

const loadProject = require("./scripts/loadProject");
const ensureDocker = require("./scripts/ensureDocker");

module.exports = () => {
  // Check requirements
  ensureDocker();

  // Ensure in project
  loadProject();

  // Ask user to confirm
  const prompt = new Confirm(
    "Are you sure you want to remove the local database?"
  );
  prompt.ask(function (answer) {
    if (answer) {
      exec("docker-compose down");
    } else {
      exec("docker-compose stop");
    }
  });
};
