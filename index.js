const { map } = require('broccoli-stew')
const fs = require('fs')

const dir =  process.cwd()
try {
	const ref = fs.readFileSync(dir  + '/.git/HEAD').toString()
	const refDir = ref.split(' ').pop()
	var commit = fs.readFileSync(dir + '/.git/' + refDir.trim()).toString().trim()
} catch (e) {
	console.error(e)
	console.warn("Broccoli-Prepend-Commit: ","The Project doesn't seems to have a valid Git Repo. Make sure your brockfile.js inside root directory of Git Repository")
	console.warn("Broccoli-Prepend-Commit: ","Skipping prepending commit hashes...")
}

module.exports = function (tree) {
	if (!commit) {
		return tree;
	}

	const js = map(tree, '**/*.js', function (content, relativePath) {
	    return  `// COMMIT: ${commit} \n` + content
	})

	const jsAndCss = map(js, '**/*.css', function (content, relativePath) {
	    return  `/* COMMIT: ${commit}  */\n` + content
	})

	const jsAndCssAndHtml = map(jsAndCss, '**/*.html', function (content, relativePath) {
	    return  `<!-- COMMIT: ${commit}  -->\n` + content
	})
	return jsAndCssAndHtml
}
