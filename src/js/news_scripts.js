fillPage();

async function fillPage() {
    let data = await app.content.get('news', {
        populate: ['preview'],
        fields: [ 'id', 'title', 'description', 'preview', 'order' ]
    });


    let $template = $('.news-page__template .news-page__item').clone();

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

        let loopCounter = 0;
        let promiseCounter = 0;
        let imgsReady = false;
        for (let total = counter, subcounter = counter; subcounter >= 0 && subcounter > (total - amount); subcounter -- ) {
            loopCounter++;
            app.storage.getURL(sortedData[subcounter].preview[0].id, {
                size: {
                    width: 375
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
        }
        if (loopCounter === promiseCounter) {
            startPublishLoop();
        } else {
            imgsReady = true;
        }


        function startPublishLoop() {
            for (let total = counter; counter >= 0 && counter > (total - amount); counter-- ) {
                console.log(counter);

                let
                    title = sortedData[counter].title,
                    description = sortedData[counter].description,
                    link = 'news-entry.html?page='+sortedData[counter].id,
                    sizedPreview = sortedData[counter].preview[0].url;

                let $item = $template.clone();

                $('.news-page__item-img a', $item).attr('href', link);
                $('.news-page__item-heading a', $item).attr('href', link).html(title);
                $('.news-page__item-description', $item).html(description);
                if(sizedPreview) {
                    $('.news-page__item-img img', $item).attr('src', sizedPreview);
                }
                else {
                    $('.news-page__item-img', $item).addClass('news-page__item-img_blank');
                }

                $('.news-page__list').append($item);

            }

            if(!$('.show-more').length) {
                $('.news-page__list').after('<div class="show-more" title="Показать больше новостей"></div>');
                $('.show-more').on('click', function () {
                    renderEntries(5);
                })
            }

            if (counter < 0) {
                $('.show-more').hide();
            }

        }


    }

}

