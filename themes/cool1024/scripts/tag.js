hexo.extend.helper.register('tag_color', function () {
  const randomNum = Math.floor(Math.random() * 10) % 4;
  return ['pink', 'blue', 'yellow', 'green'][randomNum];
});

hexo.extend.helper.register('image_hold', function (url) {
  return `<div class="w-100 h-100" style="background-image:url(${url});background-position:center;background-repeat:no-repeat;background-size:cover;"></div>`
});