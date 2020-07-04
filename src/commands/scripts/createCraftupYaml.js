const yaml = require("yaml");
const path = require("path");
const fs = require("fs");

module.exports = (name, securityKey, port, targetDir) => {
  const domainName = name.replace(/_/g, "-");

  const json = {
    name,
    port,
    securityKey,
    servers: [
      {
        name: "production",
        url: `http://${domainName}.com`,
        ftp: {
          host: "",
          webdir: "",
          username: "",
          password: "",
          port: 21,
        },
      },
    ],
  };

  fs.writeFileSync(
    path.join(targetDir, "config", "craftup.yaml"),
    yaml.stringify(json),
    "utf8"
  );
};
