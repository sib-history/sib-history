fillVideos();

async function fillVideos() {

    switchLoading(true);

    let data = {};
    await app.content.get('video', {
        populate: ['cover'],
        fields: [ 'id', 'heading', 'description', 'videoLink', 'cover', 'order' ]
    }).then((result) => {
        data = result;
    }).catch(async (e) => {
        console.warn(e);
        if(e.code === 'storage/quota-exceeded') {
            await app.content.get('video', {
                fields: [ 'id', 'heading', 'description', 'videoLink', 'order' ]
            }).then((result)=> {
                data = result;
            }).catch((e)=> {
                console.error(e);
            })
        }
    });


    let $template = $('.video-template .feature').clone();

    let sortedData = {};
    let counter = -1;
    let noOrderedItems = [];
    for (key in data) {
        if (data[key].order > -1) {
            sortedData[data[key].order] = data[key];
            counter++;
        } else {
            noOrderedItems.push(data[key]);
        }
    }
    noOrderedItems.forEach(function (item) {
        counter++;
        sortedData[counter] = item;
    });
    renderEntries(5);

    function renderEntries(amount) {
        switchLoading(true);

        let loopCounter = 0;
        let promiseCounter = 0;
        let imgsReady = false;
        for (let total = counter, subcounter = counter; subcounter >= 0 && subcounter > (total - amount); subcounter -- ) {
            loopCounter++;

            if (sortedData[subcounter].cover) {
                app.storage.getURL(sortedData[subcounter].cover[0].id, {
                    size: {
                        width: 'device'
                    }
                }).then(function (sizedCover) {
                    promiseCounter++;
                    sortedData[subcounter].cover[0].url = sizedCover;
                    if (loopCounter === promiseCounter && imgsReady) {
                        startPublishLoop();
                    }
                }).catch(function () {
                    promiseCounter++;
                    if (loopCounter === promiseCounter && imgsReady) {
                        startPublishLoop();
                    }
                });
            } else {
                promiseCounter++;
            }
        }
        if (loopCounter === promiseCounter) {
            startPublishLoop();
        } else {
            imgsReady = true;
        }


        function startPublishLoop() {
            for (let total = counter; counter >= 0 && counter > (total - amount); counter-- ) {

                let
                    $item = $template.clone(),
                    heading = sortedData[counter].heading,
                    description = sortedData[counter].description,
                    link = 'https://youtu.be/'+sortedData[counter].videoLink;

                if(sortedData[counter].cover) {
                    let sizedCover = sortedData[counter].cover[0].url;
                    $item.css('background-image', 'url("'+sizedCover+'")');
                }
                else {
                    $item.addClass('feature__inner_blank');
                }

                $('.feature__inner', $item).attr('href', link);
                $('.feature__heading', $item).html(heading);
                $('.feature__description', $item).html(description);


                $('.videos-page__list').append($item);

            }

            switchLoading(false);

            if(!$('.show-more').length) {
                $('.videos-page__list').after('<div class="show-more" title="Показать больше видео"></div>');
                $('.show-more').on('click', function () {
                    renderEntries(5);
                })
            }

            if (counter < 0) {
                $('.show-more').hide();
            }

        }


    }

    switchLoading(false);

}
