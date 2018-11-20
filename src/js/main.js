loadPartners($('.footer__partners'));
loadSpecial($('.header__projects'));

$('.header__menu-mobile-icon').on('click', function () {
    $('.header__menu-list').slideToggle();
});
$(document).on('click', '.projects-page__item-preview', function () {
    $(this).parent().addClass('_active');
});

function switchLoading(boolean) {
    var $loading = $('.loading');
    if (!$loading.length) return;

    if(boolean) {
        $loading.addClass('loading_active');

        setTimeout(function () {
            switchLoading(false);
        }, 5000)

    } else {
        $loading.removeClass('loading_active');
    }
}

function loadNewsSlider(pageData) {
    if (!checkElementExistance('.news-slider') || !pageData.imgSlider) return;

    let total = Object.keys(pageData.imgSlider).length;
    let counter = 0;
    for (key in pageData.imgSlider) {
        let url = app.storage.getURL(pageData.imgSlider[key].id, {
            size: {
                width: 'device'
            }
        });
        let sizedUrl = app.storage.getURL(pageData.imgSlider[key].id, {
            size: {
                width: 300
            }
        });

        Promise.all([url, sizedUrl]).then(values => {
            $('.news-slider').append('<a href="'+values[0]+'" data-fancybox="images"><img src="'+values[1]+'"></a>')
            counter++;
            if(counter === total) {
                initNewsSlider();
            }
        }).catch(function() {
            counter++;
            if(counter === total) {
                initNewsSlider();
            }
        });
    }
}

function initNewsSlider() {
    if (checkElementExistance('.news-slider:not(:empty)')) {
        $('.news-slider').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            swipeToSlide: true,
            autoplay: true,
            autoplaySpeed: 4000,
            lazyLoad: 'ondemand',
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
}
function initVideoSlider() {
    if (checkElementExistance('.video-slider:not(:empty)')) {
        $('.video-slider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000
        });
    }
}
function initFooterSlider($partnersContainer) {
    if (checkElementExistance($partnersContainer)) {
        $partnersContainer.slick({
            slidesToShow: 3,
            slidesToScroll: 3,
            autoplay: true,
            autoplaySpeed: 4000,
            lazyLoad: 'progressive',
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
}


function checkElementExistance (checkSelector) {
    return $(checkSelector).length >= 1;
}

function sizeFlamelinkImg(url, size) {
    // return url.replace("%2Fmedia%2F", "%2Fmedia%2Fsized%2F"+size+"%2F");
    return url;
}


function getPage() {
    let urlParams = new URLSearchParams(window.location.search);
    return +urlParams.get('page');
}


async function loadPartners($partnersContainer) {
    let data = await app.content.get('partners', { populate: [ 'img' ] });


    let total = Object.keys(data).length;
    let counter = 0;
    for (key in data) {
        let link = data[key].link;
        app.storage.getURL(data[key].img[0].id, {
            size: {
                width: 375
            }
        }).then(function (sizedUrl) {
            $partnersContainer.append('<li class="footer__partner"><a href="'+link+'" class="footer__partner-logo"><img data-lazy="'+sizedUrl+'"></a></li>');
            counter++;
            if(counter === total) {
                initFooterSlider($partnersContainer);
            }
        }).catch(function() {
            counter++;
            if(counter === total) {
                initFooterSlider($partnersContainer);
            }
        });

    }
}

async function loadSpecial($headerProjects) {
    let data = await app.content.get('special', {
        fields: [ 'title', 'preview', 'link' ]
    });


    let total = Object.keys(data).length;
    let counter = 0;
    for (key in data) {
        let link = data[key].link;
        let title = data[key].title;
        app.storage.getURL(data[key].preview[0], {
            size: {
                width: 300
            }
        }).then(function (sizedUrl) {
            $headerProjects.append('<li class="header__projects-item"><a href="'+link+'" title="'+title+'"><img class="header__projects-img" src="'+sizedUrl+'" alt="'+title+'"></a></li>');
        }).catch(function() {console.log('error while loading special')});

    }
}
