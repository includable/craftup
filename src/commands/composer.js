const { exec } = require("shelljs");

module.exports = (pkg) => {
  exec(
    "docker run --rm " +
      "--volume $PWD:/app " +
      "--volume $COMPOSER_HOME:/tmp " +
      "composer require " +
      pkg
  );
};
