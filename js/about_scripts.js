fillPage();

async function fillPage() {
    switchLoading(true);


    let data = {};
    await app.content.get('about', { populate: [ 'cover' ] }).then((result) => {
        data = result;
    }).catch(async (e) => {
        console.warn(e);
        if(e.code === 'storage/quota-exceeded') {
            await app.content.get('about', { fields: [ 'title', 'article' ] }).then((result)=> {
                data = result;
            }).catch((e)=> {
                console.error(e);
            })
        }
    });


    $('.feature__heading').html(data.title);
    $('.article').html(data.article);
    let sizedUrl = (data.cover && data.cover[0] && sizeFlamelinkImg(data.cover[0].url, '1920_9999_100')) || 'img/about-header.jpg';
    $('.feature__inner').css('background-image', 'url("'+sizedUrl+'")');

    switchLoading(false);
}

