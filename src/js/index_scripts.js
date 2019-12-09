fillVideos();
fillProjects();

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

    let $template = $('.video-template .feature__video').clone();

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
    renderEntries(2);

    function renderEntries(amount) {
        switchLoading(true);

        let loopCounter = 0;
        let promiseCounter = 0;
        let imgsReady = false;
        for (let total = counter, subcounter = counter; subcounter >= 0 && subcounter > (total - amount); subcounter -- ) {
            loopCounter++;

            if (sortedData[subcounter] && sortedData[subcounter].cover && sortedData[subcounter].cover[0]) {
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

                if(sortedData[counter].cover && sortedData[counter].cover[0]) {
                    let sizedCover = sortedData[counter].cover[0].url;
                    $item.css('background-image', 'url("'+sizedCover+'")');
                }
                else {
                    $item.addClass('feature__inner_blank');
                }

                $item.attr('href', link);
                $('.feature__heading', $item).html(heading);
                $('.feature__description', $item).html(description);


                $('.feature_videos').append($item);

            }

            switchLoading(false);
        }


    }

    switchLoading(false);

}

async function fillProjects() {

    switchLoading(true);

    let data = {};
    await app.content.get('projects', {
        populate: ['cover'],
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



    let $template = $('.project-template .feature').clone();

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
    renderEntries(3);

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
                        width: 1024
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

                let
                    title = sortedData[counter].title,
                    description = sortedData[counter].description,
                    link = 'project.html?page='+sortedData[counter].id,
                    sizedPreview = sortedData[counter].preview[0].url;

                let $item = $template.clone();

                $('.feature__inner', $item).attr('href', link);
                $('.feature__heading', $item).html(title);
                $('.feature__description', $item).html(description);
                if(sizedPreview) {
                    $('.feature__inner', $item).css('background-image', 'url("'+sizedPreview+'")');
                }
                else {
                    $('.feature__inner', $item).addClass('feature__inner_blank');
                }

                $('.projects-index-wrapper').append($item);

            }

            switchLoading(false);

        }


    }

    switchLoading(false);

}
