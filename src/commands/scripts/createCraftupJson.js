const path = require('path')
const fs = require('fs')

module.exports = (name, securityKey, port, targetDir) => {
  const json = {
    name,
    port,
    securityKey,
    servers: [{
      name: 'production',
      url: `http://${name}.com`,
      ftp: {
        host: '',
        webdir: '',
        username: '',
        password: '',
        port: 21
      }
    }]
  }

  fs.writeFileSync(
    path.join(targetDir, 'craftup.json'),
    JSON.stringify(json, null, 2), 'utf8')
}
