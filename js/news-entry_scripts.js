let page = getPage();
fillPage();

async function fillPage() {

    let data = await app.content.getByField('news', 'id', page, {
        populate: ['imgSlider', 'banner'],
        fields: [ 'title', 'imgSlider', 'videoSlider', 'article', 'banner', 'tag' ]
    });
    data = data[page];

    app.storage.getURL(data.banner[0].id, {
        size: {
            width: 'device'
        }
    }).then(function (sizedBanner) {
        $('.feature__inner').css('background-image', 'url("'+sizedBanner+'")');
    }).catch(function () {
        $('.feature__inner').css('background-image', 'url("img/news-header.jpg")');
    });

    $('.feature__heading').html(data.title);
    $('.feature__tag').html(data.tag);
    $('.article__body').html(data.article);

    for(key in data.videoSlider) {
        let link = data.videoSlider[key].videoLink;
        $('.video-slider').append('<li><iframe src="https://www.youtube.com/embed/'+link+'" frameborder="0" allow="encrypted-media" allowfullscreen></iframe></li>');
    }


    loadNewsSlider(data);
    initVideoSlider();

}
