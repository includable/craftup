const path = require("path");
const mkdirp = require("mkdirp");
const unzip = require("unzipper");
const fs = require("fs");
const chalk = require("chalk");
const { v4: uuid } = require("uuid");
const child = require("child_process");
const download = require("download-file");

const createCraftupYaml = require("./scripts/createCraftupYaml");
const createProjectYaml = require("./scripts/createProjectYaml");
const createDockerCompose = require("./scripts/createDockerCompose");

module.exports = (name) => {
  // Check name
  name = name.toLowerCase().trim();
  if (name.length > 20 || name.length < 1 || !name.match(/^[a-z0-9-_]+$/)) {
    console.log(
      chalk.red(
        `Name of your new project should consist only out of lowercase a-z, 0-9 and dashes, ` +
          `and be no more than 20 characters long.`
      )
    );
    process.exit(1);
  }

  // Create directory
  const baseDir = path.resolve(process.cwd());
  const targetDir = path.join(baseDir, name);
  if (fs.existsSync(targetDir)) {
    console.log(chalk.red(`Directory '${name} already exists'`));
    console.log(
      "Please choose a name of a non-existing directory for your new project."
    );
    process.exit(1);
  }
  try {
    mkdirp.sync(targetDir);
  } catch (err) {
    console.log(chalk.red("Error creating directory"));
    console.log(err);
    process.exit(1);
  }

  // Unzip template
  console.log(chalk.gray("• Downloading template..."));
  download(
    "https://craftup-dist.s3-eu-west-1.amazonaws.com/template.zip",
    {
      directory: targetDir,
    },
    function (err) {
      if (err) {
        console.log(chalk.red("Error downloading template"));
        console.log(err);
        process.exit(1);
      }

      console.log(chalk.gray("• Unzipping..."));
      fs.createReadStream(path.join(targetDir, "template.zip"))
        .pipe(unzip.Extract({ path: targetDir }))
        .on("error", function (err) {
          console.log(chalk.red("Error extracting template directory"));
          console.log(err);
          process.exit(1);
        })
        .on("close", () => {
          setTimeout(() => {
            console.log(chalk.gray("• Preparing directory..."));
            // Create default files
            const securityKey = uuid();
            const port = 3000 + Math.round(Math.random() * 4000);
            createCraftupYaml(name, securityKey, port, targetDir);
            createProjectYaml(name, targetDir);
            createDockerCompose(name, securityKey, port, targetDir);

            // Remove template.zip
            fs.unlinkSync(path.join(targetDir, "template.zip"));

            // Create git repo
            child.exec(
              'cd "' + name + '" && git init && chmod -R 777 storage',
              () => {
                // Output text
                console.log(`
   ✨ ${chalk.bold.green(`Done creating your new Craft CMS project!`)}
   
   First execute ${chalk.bold.yellow(
     "cd " + name
   )} to enter the directory of the new site.
   After doing that, you can run any of the following commands:
   
       ${chalk.bold.yellow("craftup start")}     ${chalk.dim(
                  "start the local development server"
                )}
       
       ${chalk.bold.yellow("craftup editor")}    ${chalk.dim(
                  "to open the site in your editor"
                )}
       
       ${chalk.bold.yellow("craftup push")}      ${chalk.dim(
                  "to upload the files to production"
                )}
       ${chalk.bold.yellow("craftup pull")}      ${chalk.dim(
                  "to pull the production database"
                )}
`);
              }
            );
          }, 300);
        });
    }
  );
};
