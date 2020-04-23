hexo.extend.generator.register('about', function (locals) {
    return { path: 'about/index.html', data: locals, layout: 'about' };
});