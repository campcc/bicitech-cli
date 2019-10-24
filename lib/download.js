const ora = require("ora")
const downloader = require("download-git-repo")
const spinner = ora("downloading template")

module.exports = (repo, destination) => {
  const host = "direct:https://github.com/"
  const url = host + repo
  const options = { clone: true }
  return new Promise((resolve, reject) => {
    spinner.start()
    downloader(url, destination, options, err => {
      if (err) {
        spinner.fail()
        reject(err)
      } else {
        spinner.succeed()
        resolve(destination)
      }
    })
  })
}
