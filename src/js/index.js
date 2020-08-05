//Инициализация модальных окон
const modal = {
    modal: null,
    activeModal : null,
    path: 'img/',
    createModal: function ({modalName, youTube}) {
        //Создаем родильский div
        const modalW = document.createElement('div');
        modalW.classList.add('modal');

        //Создаем кнопку закрыть
        const close = document.createElement('button');
        close.classList.add('modal--close');
        close.dataset.close = 'true';
        close.insertAdjacentHTML('afterbegin', `<svg class="icon icon-close"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${this.path}sprite.svg#close"></use></svg>`)

        //Создаем обертку
        const wrapper = document.createElement('div');
        wrapper.classList.add('modal--content');
        wrapper.dataset.close = 'true';

        // Провереяем есть ли youtube
        if (!youTube) {
            const content = document.querySelector(modalName);
            console.log('Content', content);
            console.log('Close', close);
            content.insertAdjacentElement('afterbegin', close);

            wrapper.appendChild(content);
            modalW.appendChild(wrapper);
        } else {
            let iframe = document.createElement('iframe'),
                wrapper = document.createElement('div'),
                content = document.createElement('div');

            content.classList.add('modal--youtube');
            content.insertAdjacentElement('afterbegin', close);
            wrapper.classList.add('modal--content');
            iframe.setAttribute('src', `https://www.youtube.com/embed/${youTube}?enablejsapi=1&amp;rel=0&amp;showinfo=0&autoplay=1`);
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '100%');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');

            content.appendChild(iframe);
            wrapper.appendChild(content);
            modalW.appendChild(wrapper);
        }

        document.body.appendChild(modalW);

        modalW.addEventListener('click', event => {
            if (event.target.dataset.close === 'true') {
                modal.close();
            }
        });

        //Возвращаем модальное окно
        return modalW;
    },
    init: function() {
        const openButton = document.querySelectorAll('[data-button]');

        openButton.forEach((button, index) => {
            button.addEventListener('click', event => {
                event.preventDefault();
                modal.handler({
                    modalName: button.dataset.modal,
                    youTube: button.dataset.youtube
                });
            });
        });
    },
    handler: function (options) {
        this.activeModal && this.close();
        setTimeout(() => {
            this.modal = modal.createModal(options);
            this.activeModal = options.modalName;
            this.open()
        }, 300);

    },
    open: function () {
        setTimeout(() => {
            this.modal.classList.add('modal--open');
            document.body.classList.add('modal--opened');
        }, 200);
    },
    close: function () {

        this.modal.classList.remove('modal--open');
        document.body.classList.remove('modal--opened');
        modal.destroy();
    },
    destroy: function () {
        setTimeout(() => {
            this.modal.remove();
            document.querySelector('.modals').appendChild(this.modal.querySelector(this.activeModal));
            this.activeModal = null;
        }, 300);

    }
};
modal.init();

//Инициализация слайдеров
let initSlider = function() {
    var slider  = document.getElementsByClassName('slider');

    if (slider.length >= 1 && !sliderNav) {
        for (var i = 0; i < slider.length; i++) {
            var sliderName = slider[i].dataset.slider,
                sliderNav = slider[i].dataset.nav || false,
                sliderNavigator  = slider[i].dataset.navigator;

            $(sliderName).on('init', function(event, slick){
                $(this).addClass('active');
                $(this).next('.nav-slider').addClass('active');
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
                                slidesToShow: 3,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 3,
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

//Инициализация акордионов
let accordion = {
    item: document.querySelectorAll('.accordion-title'),
    desc: document.querySelectorAll('.accordion-desc'),
    active: 'active',
    init: function () {
        this.item.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.handler(item);
            });
        });

        this.desc.forEach((item, inxex) => {
            let height = item.scrollHeight;
            item.style.maxHeight = `${height + 30}px`;
        });
    },
    handler: function (item) {
        let desc = item.nextElementSibling;
        let height = desc.scrollHeight;

        console.log(item.classList.contains(this.active));
        console.log(height);
        if (item.parentNode.classList.contains(this.active)) {
            desc.style.maxHeight = `${height + 25}px`;
            item.parentNode.classList.remove(this.active);

        } else {
            desc.style.maxHeight = `0px`;
            item.parentNode.classList.add(this.active);
        }
    }
};


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