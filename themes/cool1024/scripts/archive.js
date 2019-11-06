hexo.extend.helper.register('archives', function (posts) {
    const groups = [];
    posts.forEach(function (post) {
        const index = groups.findIndex(function (g) {
            return g.year === post.date.format('YYYY');
        });
        if (index < 0) {
            groups.push({
                year: post.date.format('YYYY'),
                posts: [post]
            })
        } else {
            groups[index].posts.push(post);
        }
    });
    return groups;
});