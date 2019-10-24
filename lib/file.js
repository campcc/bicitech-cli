const fs = require("fs")
const ora = require("ora")
const rimraf = require('rimraf')

const unlinkSyncAll = paths => {
	const spinner = ora("async delete file")
	try {
		spinner.start()
		paths.forEach(path => fs.unlinkSync(path))
		spinner.succeed()
	} catch (error) {
		spinner.fail()
		console.log(error)
	}
}

const readFileSync = path => {
	const spinner = ora("async reading file")
	try {
		spinner.start()
    const buffer = fs.readFileSync(path)
		const bufferJson = JSON.parse(buffer)
		spinner.succeed()
		return bufferJson
	} catch (error) {
		spinner.fail()
		console.log(error)
	}
}

const writeFileSync = (path, data) => {
  const spinner = ora("async writing file")
  try {
		spinner.start()
    const buffer = fs.readFileSync(path)
    const bufferJson = JSON.parse(buffer)
    const coverData = { ...bufferJson, ...data }
    const newBuffer = JSON.stringify(coverData, null, "\t")
    fs.writeFileSync(path, newBuffer)
    spinner.succeed()
  } catch (error) {
		spinner.fail()
		console.log(error)
  }
}

const rmdirSync = path => {
	const spinner = ora("async remove folder")
	try {
		spinner.start()
		rimraf.sync(path)
		spinner.succeed()
	} catch (error) {
		spinner.fail()
		console.log(error)
	}
}

const renameSync = (oldPath, newPath) => {
	const spinner = ora("async rename")
	try {
		spinner.start()
		fs.renameSync(oldPath, newPath)
		spinner.succeed()
	} catch (error) {
		spinner.fail()
		console.log(error)
	}
}

module.exports = {
	unlinkSyncAll,
	renameSync,
	rmdirSync,
	readFileSync,
  writeFileSync,
}
