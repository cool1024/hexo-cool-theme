const { watch } = require('gulp')
const fs = require('fs')
const spawn = require('child_process').spawn
const sysPath = require('path')
const sass = require('sass')

const sassDir = sysPath.join(__dirname, 'themes/cool1024/scss')
const buildDir = sysPath.join(__dirname, 'themes/cool1024/source/style')


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

function runServe() {
    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

    const server = spawn(cmd, ['run', 'serve'], {
        cwd: __dirname
    })
    server.stdout.on('data', e => console.log(e.toString()))
    server.stderr.on('data', e => console.log(e))
}

function buildSass(cb) {
    compileSassFile('theme')
    compileSassFile('archives')
    compileSassFile('index')
    cb()
}

exports.default = function () {
    // 监听文件变更
    watch(sassDir, { ignoreInitial: false }, buildSass);

    // 启动服务器
    runServe()
}