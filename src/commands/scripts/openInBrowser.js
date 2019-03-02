const axios = require('axios')
const openBrowser = require('@includable/open-browser')

module.exports = (port) => {
  axios
    .get(`http://localhost:${port}/`, {timeout: 1000})
    .then(() => openBrowser(`http://localhost:${port}/`))
    .catch(() => openBrowser(`http://localhost:${port}/admin`))
}
