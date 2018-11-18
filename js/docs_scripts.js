fillPage();

async function fillPage() {

    switchLoading(true);

    let data = await app.content.get('docs', {
        populate: ['preview'],
        fields: [ 'title', 'preview', 'video',  'fileLink' ]
    });



    let $template = $('.docs-template .docs-page__item').clone();

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
        for (let remainder = (counter - amount), subcounter = counter; subcounter >= 0 && subcounter > remainder; subcounter -- ) {
            loopCounter++;
            if (sortedData[subcounter].preview) {

                app.storage.getURL(sortedData[subcounter].preview[0].id, {
                    size: {
                        width: 400
                    }
                }).then(function (sizedPreview) {
                    promiseCounter++;
                    sortedData[subcounter].sizedPreview = sizedPreview;
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
                    title = sortedData[counter].title,
                    videoLink = sortedData[counter].video,
                    fileLink = sortedData[counter].fileLink;


                $('h3', $item).html(title);

                if(sortedData[counter].preview) {

                    let preview = sortedData[counter].preview[0].url,
                        sizedPreview = sortedData[counter].sizedPreview;

                    $('.docs-page__file img', $item).attr('src', sizedPreview);

                    fileLink = (fileLink) ? fileLink : preview;
                    $('.docs-page__file', $item).attr('href', fileLink);

                }
                else {
                    $('.docs-page__file', $item).attr('hidden', true);
                }

                if(videoLink) {
                    $('.docs-page__video iframe', $item).attr('src', 'https://www.youtube.com/embed/' +videoLink)
                }
                else {
                    $('.docs-page__video', $item).attr('hidden', true);
                }

                $('.article').append($item);

            }

            switchLoading(false);

            if(!$('.show-more').length) {
                $('.article').after('<div class="show-more" title="Показать больше документов"></div>');
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

