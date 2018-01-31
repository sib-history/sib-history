function checkElementExistance (checkSelector) {
    return $(checkSelector).length >= 1;
}

$('.header__menu-mobile-icon').on('click', function () {
    $('.header__menu-list').slideToggle();
});
$('.projects-page__item-preview').on('click', function () {
    $(this).parent().addClass('_active');
});
if (checkElementExistance('.news-slider')) {
    $('.news-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
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
if (checkElementExistance('.video-slider')) {
    $('.video-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000
    });
}