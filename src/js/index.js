let vars = require('./modules/_var');
let modal = require('./modules/modal');


modal({
    debug: true,
    button: '[data-button="open"]',
});


var initSlider = function () {
    var slider = document.getElementsByClassName('slider');

    if (slider.length >= 1 && !sliderNav) {
        for (var i = 0; i < slider.length; i++) {
            var sliderName = slider[i].dataset.slider,
                sliderNav = slider[i].dataset.nav || false,
                sliderNavigator = slider[i].dataset.navigator;

            $(sliderName).on('init', function (event, slick) {
                $(this).addClass(vars.active);
                $(this).next('.nav-slider').addClass(vars.active);
            });

            if (sliderNav) {
                $(sliderName).not('.slick-initialized').slick({
                    infinite: false,
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    lazyLoad: 'ondemand',
                    asNavFor: sliderNavigator
                });

                $(sliderNavigator).slick({
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    asNavFor: sliderName,
                    dots: false,
                    arrows: true,
                    focusOnSelect: true,
                    prevArrow: '<button type="button" class="slick-prev"><svg class="icon icon-arrow-down"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/sprite.svg#arrow-down"></use></svg></button>',
                    nextArrow: '<button type="button" class="slick-next"><svg class="icon icon-arrow-down"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/sprite.svg#arrow-down"></use></svg></button>',
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                            }
                        }
                    ]
                });
            } else {
                $(sliderName).not('.slick-initialized').slick({
                    infinite: false,
                    arrows: true,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    lazyLoad: 'ondemand',
                    prevArrow: '<button type="button" class="slick-prev"><svg class="icon icon-arrow-down"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/sprite.svg#arrow-down"></use></svg></button>',
                    nextArrow: '<button type="button" class="slick-next"><svg class="icon icon-arrow-down"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/sprite.svg#arrow-down"></use></svg></button>'
                });
            }
        }
    }
};

initSlider();


var initMap = function () {
    var map = document.getElementById('map');
    if (map) {
        ymaps.ready(init);

        function init() {
            var myMap = new ymaps.Map('map', {
                center: [43.229839, 76.959317],
                zoom: 16
            });
            var myPlacemark = new ymaps.Placemark(
                [43.229839, 76.959317], {
                    hintContent: 'Unico'
                }, {
                    iconImageHref: 'img/pin.png', // РєР°СЂС‚РёРЅРєР° РёРєРѕРЅРєРё
                    iconImageSize: [44, 44], // СЂР°Р·РјРµСЂС‹ РєР°СЂС‚РёРЅРєРё
                    iconImageOffset: [-50, -70] // СЃРјРµС‰РµРЅРёРµ РєР°СЂС‚РёРЅРєРё
                });
            myMap.geoObjects.add(myPlacemark);
        }
    }
};

initMap();


function testWebP(callback) {

    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

    if (support == true) {
        document.querySelector('body').classList.add('webp');
    } else {
        document.querySelector('body').classList.add('no-webp');
    }
});