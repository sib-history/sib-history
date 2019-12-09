let page = getPage();
fillPage();

async function fillPage() {

    switchLoading(true);

    let data = {};
    await app.content.getByField('news', 'id', page, {
        populate: ['imgSlider', 'banner'],
        fields: [ 'title', 'imgSlider', 'videoSlider', 'article', 'banner', 'tag' ]
    }).then((result) => {
        data = result;
    }).catch(async (e) => {
        console.warn(e);
        if(e.code === 'storage/quota-exceeded') {
            await app.content.getByField('news', 'id', page, {
                fields: [ 'title', 'videoSlider', 'article', 'tag' ]
            }).then((result)=> {
                data = result;
            }).catch((e)=> {
                console.error(e);
            })
        }
    });

    data = data[page];

    if(data && data.banner && data.banner[0]) {
        app.storage.getURL(data.banner[0].id, {
            size: {
                width: 'device'
            }
        }).then(function (sizedBanner) {
            $('.feature__inner').css('background-image', 'url("'+sizedBanner+'")');
        }).catch(function () {
            $('.feature__inner').css('background-image', 'url("img/news-header.jpg")');
        });
    } else $('.feature__inner').css('background-image', 'url("img/news-header.jpg")');

    $('.feature__heading').html(data.title);
    $('.feature__tag').html(data.tag);
    $('.article__body').html(data.article);

    for(key in data.videoSlider) {
        let link = data.videoSlider[key].videoLink;
        $('.video-slider').append('<li><iframe src="https://www.youtube.com/embed/'+link+'" frameborder="0" allow="encrypted-media" allowfullscreen></iframe></li>');
    }

    switchLoading(false);


    loadNewsSlider(data);
    initVideoSlider();

}

