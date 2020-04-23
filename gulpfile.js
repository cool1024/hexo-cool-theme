const { watch, series, parallel } = require('gulp')
const fs = require('fs')
const spawn = require('child_process').spawn
const sysPath = require('path')
const sass = require('sass')

const sassDir = sysPath.join(__dirname, 'themes/cool1024/scss')
const buildDir = sysPath.join(__dirname, 'themes/cool1024/source/style')


function runServe() {
    spawn('npm run dev').stdout.on('data', e => console.log(e.toString()))
    return new Promise()
}

function runSassBuild() {
    watch(sassDir, function (cb) {
        console.log('Build sass...')
        buildSass();
        cb()
    });
    buildSass()
}

function buildSass() {
    compileSassFile('theme')
    compileSassFile('archives')
    compileSassFile('index')
}

/**
 * Compile a sass file
 * @param {String} name sass file name
 */
function compileSassFile(name) {
    path = sysPath.join(sassDir, `${name}.scss`)
    savePath = sysPath.join(buildDir, `${name}.css`)
    try {
        const result = sass.renderSync({ file: path })
        fs.writeFileSync(savePath, result.css)
    } catch (e) {
        console.error(e)
    }
}

exports.default = parallel(runServe, runSassBuild)