fillPage();

async function fillPage() {
    switchLoading(true);

    let data = await app.content.get('about', { populate: [ 'cover' ] });


    $('.feature__heading').html(data.title);
    $('.article').html(data.article);
    let sizedUrl = sizeFlamelinkImg(data.cover[0].url, '1920_9999_100');
    $('.feature__inner').css('background-image', 'url("'+sizedUrl+'")');

    switchLoading(false);
}

