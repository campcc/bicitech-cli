module.exports = function(projectName) {
	const baseDestination = process.cwd() + '/' + projectName
	return {
		root: baseDestination,
		packageJson: baseDestination + '/package.json',
		travis: baseDestination + '/.travis.yml',
		eslint: baseDestination + '/.eslintrc.js',
		eslintignore: baseDestination + '/.eslintignore',
		src: baseDestination + '/src',
		simple: baseDestination + '/simple',
	}
}
