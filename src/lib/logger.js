const chalk = require("chalk");

module.exports = {
  system: (message) => {
    return chalk.bold(message);
  },
  subsystem: (message) => {
    return "    " + chalk.gray(message);
  },
};
