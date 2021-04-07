const Confirm = require("prompt-confirm");

const error = (message, exitCode = 1) => {
  console.log(message); // TODO: color
  process.exit(exitCode);
};

const info = (message) => {
  console.log(message); // TODO: color
};

const confirm = (message) =>
  new Promise((resolve) => {
    const prompt = new Confirm(
      "Are you sure you want overwrite your local database?"
    );
    prompt.ask((answer) => resolve(answer));
  });

module.exports = {
  error,
  info,
  confirm,
};
