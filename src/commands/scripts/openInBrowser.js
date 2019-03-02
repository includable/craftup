const ora = require('ora')
const axios = require('axios')
const openBrowser = require('@includable/open-browser')

let spinner

const browser = (url) => {
  openBrowser(url)
  spinner.succeed()
}

module.exports = (port) => {
  spinner = ora(`Opening localhost:${port} in browser`).start()
  axios
    .get(`http://localhost:${port}/`, {timeout: 3000})
    .then(() => browser(`http://localhost:${port}/`))
    .catch(() => browser(`http://localhost:${port}/admin`))
}
