const ora = require("ora");
const ftp = require("basic-ftp");
const axios = require("axios");
const crypto = require("crypto");

const ensureDocker = require("./scripts/ensureDocker");
const loadProject = require("./scripts/loadProject");
const { error, info, confirm } = require("../utils/output");

const load = require("./load");
const { populateValue } = require("../utils/vals");

const connect = async (ftpDetails) => {
  const spinner = ora("Performing connection check").start();

  const client = new ftp.Client();
  try {
    await client.access({
      host: populateValue(ftpDetails.host),
      user: populateValue(ftpDetails.username),
      password: populateValue(ftpDetails.password),
    });
  } catch (e) {
    spinner.fail("Could not connect to FTP server");
    error(e);
  }

  spinner.stop();
  return client;
};

const getFilename = () => {
  const id = crypto.randomBytes(12).toString("hex");
  return `__craftup_${id}.php`;
};

const uploadAndExecute = async (connection, server, scriptName) => {
  let res = { data: null };
  const webDir = server.ftp.webdir.replace(/\/$/, "");
  const fileName = getFilename();

  await connection.uploadFrom(
    `${__dirname}/../php/${scriptName}.php`,
    `${webDir}/${fileName}`
  );

  const url = `${server.url.replace(/\/$/, "")}/${fileName}`;
  try {
    res = await axios.get(url);
    await connection.remove(`${webDir}/${fileName}`, true);
  } catch (e) {
    await connection.remove(`${webDir}/${fileName}`, true);
    throw e;
  }

  return res.data.trim();
};

const selfcheck = async (connection, server) => {
  const spinner = ora("Performing connection check").start();

  const webDir = server.ftp.webdir.replace(/\/$/, "");
  const fileName = getFilename();
  const url = `${server.url.replace(/\/$/, "")}/${fileName}`;

  try {
    await connection.uploadFrom(
      `${__dirname}/../php/selfcheck.php`,
      `${webDir}/${fileName}`
    );

    try {
      const { data } = await axios.get(url);
      const magicString = "<<<89shd98hgs90dg9sgugaouhsaosnjska>>>";
      if (!data.includes(magicString)) {
        try {
          await connection.remove(`${webDir}/${fileName}`, true);
        } catch (e) {}
        spinner.fail("Failed connection check");
        error(data.replace(/<[a-z]{1,3}( \/)?>/gi, "").trim());
      }
    } catch (e) {
      spinner.fail("Failed connection check");
      error(
        `Got response code ${e.response.status} from ${url}. That probably means that we failed to write a file to your FTP web root.`
      );
    }
    await connection.remove(`${webDir}/${fileName}`, true);
  } catch (e) {
    spinner.fail("Failed connection check");
    error(`Could not upload file to FTP server: ${e}`);
  }

  spinner.stop();
};

module.exports = async (serverName, command) => {
  ensureDocker();

  // Get server info
  const project = loadProject();
  if (!project.servers.length) {
    error("No servers defined in config/craftup.yml");
  }
  const server = serverName
    ? project.servers.find((server) => server.name === serverName)
    : project.servers[0];
  if (!server) {
    error(`No server found with name "${serverName}".`);
  }

  // Prompt: sure you want to overwrite your local database?
  if (!command.yes) {
    if (
      !(await confirm("Are you sure you want overwrite your local database?"))
    ) {
      process.exit(1);
    }
  }

  // Connect to FTP
  info(`Using server ${server.name} (${server.url})`);
  const connection = await connect(server.ftp);
  await selfcheck(connection, server);

  // Upload file to create SQL
  let spinner = ora("Creating database backup").start();
  const data = await uploadAndExecute(connection, server, "downloadDatabase");
  spinner.succeed();
  const webDir = server.ftp.webdir.replace(/\/$/, "");

  // Download SQL
  spinner = ora("Downloading backup from server").start();
  await connection.downloadTo("database.sql", `${webDir}/${data}`);
  await connection.remove(`${webDir}/${data}`, true);
  spinner.succeed();
  connection.close();

  // Import SQL
  return load(null, true);
};
