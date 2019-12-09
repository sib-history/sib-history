fillPage();

async function fillPage() {

    switchLoading(true);


    let data = {};
    await app.content.get('projects', {
        populate: ['preview'],
        fields: [ 'id', 'title', 'description', 'preview', 'order' ]
    }).then((result) => {
        data = result;
    }).catch(async (e) => {
        console.warn(e);
        if(e.code === 'storage/quota-exceeded') {
            await app.content.get('projects', {
                fields: [ 'id', 'title', 'description', 'order' ]
            }).then((result)=> {
                data = result;
            }).catch((e)=> {
                console.error(e);
            })
        }
    });



    let $template = $('.projects-page__template .projects-page__item').clone();

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

            if (sortedData[subcounter] && sortedData[subcounter].preview && sortedData[subcounter].preview[0]) {
                app.storage.getURL(sortedData[subcounter].preview[0].id, {
                    size: {
                        width: 880
                    }
                }).then(function (sizedPreview) {
                    promiseCounter++;
                    sortedData[subcounter].preview[0].url = sizedPreview;
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
                if(sortedData[counter]) {
                    let
                        title = sortedData[counter].title,
                        description = sortedData[counter].description,
                        link = 'project.html?page='+sortedData[counter].id,
                        sizedPreview = sortedData[counter].preview && sortedData[counter].preview[0].url;

                    let $item = $template.clone();

                    $('.projects-page__item-link', $item).attr('href', link);
                    $('.projects-page__item-btn a', $item).attr('href', link);
                    $('.projects-page__item-heading a', $item).attr('href', link).html(title);
                    $('.projects-page__item-preview-title', $item).html(title);
                    $('.projects-page__item-description', $item).html(description);
                    if(sizedPreview) {
                        $('.projects-page__item-img', $item).attr('src', sizedPreview);
                    }
                    else {
                        $('.projects-page__item-img', $item).addClass('projects-page__item-img_blank');
                    }

                    $('.projects-page__list').append($item);
                }
            }

            switchLoading(false);

            if(!$('.show-more').length) {
                $('.projects-page__list').after('<div class="show-more" title="Показать больше проектов"></div>');
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

