const yaml = require("yaml");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");

const toHumanReadable = (s) =>
  s.replace(/(([-_]|^)([a-z]|\d))/gi, (x) =>
    x.toUpperCase().replace(/(-|_)/g, " ")
  );

module.exports = (name, targetDir) => {
  const domainName = name.replace(/_/g, "-");
  const humanName = toHumanReadable(name);

  const siteGroupId = uuid();
  const json = {
    dateModified: Math.floor(new Date().valueOf() / 1000),
    email: {
      fromEmail: `admin@${domainName}.com`,
      fromName: humanName,
      transportType: "craft\\mail\\transportadapters\\Sendmail",
    },
    fieldGroups: {
      [uuid()]: {
        name: "Common",
      },
    },
    plugins: {
      "aws-s3": {
        edition: "standard",
        enabled: true,
        schemaVersion: "1.2",
      },
      redactor: {
        edition: "standard",
        enabled: true,
        schemaVersion: "2.3.0",
      },
    },
    siteGroups: {
      [siteGroupId]: {
        name: humanName,
      },
    },
    sites: {
      [uuid()]: {
        baseUrl: "@web",
        handle: "default",
        hasUrls: true,
        language: "en-US",
        name: humanName,
        primary: true,
        siteGroup: siteGroupId,
        sortOrder: 1,
      },
    },
    system: {
      edition: "solo",
      live: true,
      name: humanName,
      schemaVersion: "3.4.10",
      timeZone: "Europe/Amsterdam",
    },
    users: {
      allowPublicRegistration: false,
      defaultGroup: null,
      photoSubpath: "",
      photoVolumeUid: null,
      requireEmailVerification: true,
    },
    volumes: {
      [uuid()]: {
        handle: "uploads",
        hasUrls: true,
        name: "Uploads",
        settings: {
          path: "@webroot/uploads",
        },
        sortOrder: 1,
        type: "craft\\volumes\\Local",
        url: "@web/uploads",
      },
    },
  };

  fs.writeFileSync(
    path.join(targetDir, "config", "project.yaml"),
    yaml.stringify(json),
    "utf8"
  );
};
