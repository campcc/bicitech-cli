#!/usr/bin/env node

const fs = require("fs")
const chalk = require("chalk")
const commander = require("commander")
const inquirer = require("inquirer")
const packageJson = require("../package.json")
const downloader = require("../lib/download")
const questions = require("./question")
const { unlinkSyncAll, writeFileSync } = require("../lib/file")

const program = new commander.Command()

program
  .version(packageJson.version, "-v, --version", "output the version")
  .option("init, --init", "quick start with questions")
  .parse(process.argv)

if (program.init) {
  inquirer.prompt(questions).then(answers => {
    const { name, version, description, eslint } = answers
    const isExist = fs.existsSync(name)
    // validate if project name has exist
    if (isExist) {
      console.warn(
        `${chalk.red(
          "✘"
        )} error: project name has existed, please remove or change a destination and try again.`
      )
    } else {
      const destination = `${process.cwd()}/${name}`
      downloader("campcc/bicitech-template-web", destination)
        .then(() => {
          // cover the project name, version & desc which are passed in inquirer
          const packageJsonPath = `${destination}/package.json`
          const coverData = { name, version, description }
          writeFileSync(packageJsonPath, coverData)
          // unlink eslint relative files if no need
          if (!eslint) {
            const paths = [
              `${destination}/.eslintrc`,
              `${destination}/.eslintignore`,
            ]
            unlinkSyncAll(paths)
          }
          console.log(
            `\n${chalk.green(
              "build successfully!\n\ncd   "
            )}bici-web\n${chalk.green("run")}  yarn\n\n${chalk.green(
              "happy development!"
            )}\n`
          )
          process.exit()
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
}
