#!/usr/bin/env node

const fs = require("fs")
const ora = require("ora")
const chalk = require("chalk")
const commander = require("commander")
const inquirer = require("inquirer")
const packageJson = require("../package.json")
const downloader = require("../lib/download")
const questions = require("./question")
const url = require("./url")
const omit = require("omit.js")
const {
  unlinkSyncAll,
  readFileSync,
  writeFileSync,
  renameSync,
  rmdirSync,
} = require("../lib/file")
const destinationResolver = require("./destination")
const { exec } = require("child_process")

const program = new commander.Command()

program
  .version(packageJson.version, "-v, --version", "output the version")
  .option("init, --init", "quick start with questions")
  .parse(process.argv)

if (program.init) {
  inquirer.prompt(questions).then(answers => {
    const { name, type, version, description, redux, eslint } = answers
    // get resolved destination paths
    const destination = destinationResolver(name)
    const isExist = fs.existsSync(name)
    // validate if project name has exist
    if (isExist) {
      console.warn(
        `\n${chalk.red(
          "error: "
        )}project name has existed, please remove or change a destination and try again.\n`
      )
    } else {
      console.log(
        `\nCreating a new React ${type} app in ${chalk.greenBright(process.cwd())}.\n`
      )
      const address = type === "web" ? url.web : url.wap
      downloader(address, destination.root)
        .then(() => {
          try {
            let coverData = { name, version, description }
            const packageJsonData = readFileSync(destination.packageJson)
            const {
              devDependencies: prevDevDep,
              dependencies: prefDep,
            } = packageJsonData
            // remove travis yml
            unlinkSyncAll([destination.travis])
            if (!redux && type === "web") {
              // update package.json dep if do not need redux
              const dependencies = omit(prefDep, [
                "react-redux",
                "redux",
                "redux-logger",
                "redux-persist",
                "redux-thunk",
              ])
              coverData = { ...coverData, dependencies }
              // get simple src files
              rmdirSync(destination.src)
              renameSync(destination.simple, destination.src)
            } else {
              // remove simple src files
              rmdirSync(destination.simple)
            }
            // unlink eslint relative files, update package.json dev dep if no need
            if (!eslint) {
              const devDependencies = omit(prevDevDep, [
                "babel-eslint",
                "eslint",
                "eslint-config-airbnb",
                "eslint-config-prettier",
                "eslint-plugin-babel",
                "eslint-plugin-import",
                "eslint-plugin-jsx-a11y",
                "eslint-plugin-react",
              ])
              coverData = { ...coverData, devDependencies }
              unlinkSyncAll([destination.eslint, destination.eslintignore])
            }
            // cover package.json data passed in inquirer
            writeFileSync(destination.packageJson, coverData)
          } catch (error) {
            console.log(error)
            process.exit()
          }
          console.log(`\n${chalk.green("success")} template is ready\n`)
          try {
            const spinner = ora(
              "🚚  fetching dependencies, this might take a couple of minutes.\n"
            )
            spinner.start()
            exec(`cd ${name} && yarn`, (err, stdout) => {
              if (err) {
                throw err
              }
              spinner.succeed()
              console.log(
                `${chalk.green(
                  `Successfully create ${name}`
                )}\n\nNow, you can begin by typing:\n\n  ${chalk.green(
                  "cd"
                )} ${name}\n\n  ${chalk.green("yarn start")}\n\nHappy hacking!`
              )
              process.exit()
            })
          } catch (error) {
            spinner.fail()
            console.log(error)
            process.exit()
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
}
