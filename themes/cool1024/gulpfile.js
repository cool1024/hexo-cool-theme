const { watch } = require('gulp');

exports.default = function () {
    watch('src/scss/*.scss', function (cb) {
        console.log('SASS-编译开始');
        require('child_process').exec('npm run sass-build', function () {
            console.log('SASS-编译结束');
            cb();
        });
    });
}