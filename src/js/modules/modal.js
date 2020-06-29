module.exports = $.modal = function (options) {
    const path = 'img/';

    function createModal({modalName, youTube}) {
        console.log(modalName, youTube, document.querySelector(modalName));
        //Создаем родильский div
        const modal = document.createElement('div');
        modal.classList.add('w-modal');

        //Создаем кнопку закрыть
        const close = document.createElement('button');
        close.classList.add('w-modal--close');
        close.dataset.close = 'true';
        close.insertAdjacentHTML('afterbegin', `<svg class="icon icon-close"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${path}sprite.svg#close"></use></svg>`)

        //Создаем обертку
        const wrapper = document.createElement('div');
        wrapper.classList.add('w-modal--wrapper');
        wrapper.dataset.close = 'true';

        //Создаем контент
        const content = document.createElement('div');
        content.classList.add('w-modal--content');
        content.appendChild(close);

        //Провереяем есть ли youtube
        if (!youTube) {
            content.appendChild(document.querySelector(modalName));
        } else {
            let iframe = document.createElement('iframe'),
                wrapper = document.createElement('div');

            wrapper.classList.add('w-modal--youtube');
            iframe.setAttribute('src', `https://www.youtube.com/embed/${youTube}?enablejsapi=1&amp;rel=0&amp;showinfo=0&autoplay=1`);
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '100%');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');

            wrapper.appendChild(iframe);
            content.appendChild(wrapper);
        }


        wrapper.appendChild(content);
        modal.appendChild(wrapper);

        document.body.appendChild(modal);


        modal.addEventListener('click', event => {
            if (event.target.dataset.close === 'true') {
                handler.close();
            }
        });

        //Возвращаем модальное окно
        return modal;
    }



    const handler = {
        modal: null,
        activeModal : null,
        init: function (options) {
            this.modal = createModal(options);
            this.activeModal = options.modalName;
            this.open()
        },
        open: function () {
            setTimeout(() => {
                this.modal.classList.add('w-modal--open');
                document.body.classList.add('modal--opened');
            }, 200);

        },
        close: function () {
            this.modal.classList.remove('w-modal--open');

            setTimeout(() => {
                document.body.classList.remove('modal--opened');
                handler.destroy()
            }, 500);

        },
        destroy: function () {
            this.modal.remove();
            document.querySelector('.modal').appendChild(this.modal.querySelector(this.activeModal));
        }
    };


    (function () {
        const openButton = document.querySelectorAll(options.button);

        openButton.forEach((button, index) => {
            button.addEventListener('click', event => {
                handler.init({
                    modalName: event.target.dataset.modal,
                    youTube: event.target.dataset.youtube
                });
            });
        });

    }());
};
