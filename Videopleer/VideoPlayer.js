import { PlaylistLoader } from './playListLoader.js';

export class VideoPlayer {
    constructor() {
        this.playlistLoader = new PlaylistLoader();
        this.content = [];
        this.currentIndex = 0;
        this.autoplay = false;

        // Получаем элементы управления
        this.autoplayButton = document.getElementById('autoplayButton');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        // this.htmlButtonPause = document.getElementById("mainVideo");

        // Получаем медиа элементы
        this.imageElement = document.getElementById('imagesContainer');
        this.videoElement = document.getElementById('mainVideo');
        this.imageTimeout = null;
        this.boundChangeContent = null; //! Добавляем переменную для хранения привязанной функции
        this.init();
    }

    async init() {
        await this.playlistLoader.loadContent();
        this.content = this.playlistLoader.getContent();
        this.setupEventListeners();
        this.changeMedia(this.currentIndex);
        this.generatePlaylist();
    }

    // todo Вынести в отдельные фцнкции убрать стрелочные!
    setupEventListeners() {
        this.autoplayButton.addEventListener('click', () => this.toggleAutoplay());
        this.prevButton.addEventListener('click', () => this.changeContent(-1));
        this.nextButton.addEventListener('click', () => this.changeContent(1));
        // this.htmlButtonPause.addEventListener('click', () => this.pauseVideo());
    }

    // pauseVideo() {
    //     // const autoPlay = !this.autoplay
    //     const htmlButtonPause = this.htmlButtonPause
    //         if (htmlButtonPause.addEventListener('pause')) {
    //             this.autoplay = false;
    //             this.toggleAutoplay();
    //         }
    // }

    generatePlaylist() {
        const thumbnailsContainer = document.querySelector('.thumbnails');
        thumbnailsContainer.innerHTML = '';

        this.content.forEach((media, index) => {
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.classList.add('thumbnail');

            if (media.isVideo) {
                thumbnailDiv.classList.add('thumbnail-video');
            }

            thumbnailDiv.setAttribute('data-index', index);

            const typeIcon = media.isVideo ? '▶️' : '🖼️';

            thumbnailDiv.innerHTML = `
                <img src="${media.thumbnail || media.src}" alt="${media.title}">
                <span>${typeIcon} ${media.title}</span>
            `;

            thumbnailDiv.addEventListener('click', () => {
                this.currentIndex = index;
                this.changeMedia(index);
            });

            thumbnailsContainer.appendChild(thumbnailDiv);
        });

        this.highlightCurrentThumbnail(this.currentIndex);
    }

    // untieChangeMedia() {
    //     this.changeContent.bind(this, 1);
    // };

    //     dontChangeMedia () {
    //     this.untieChangeMedia.bind(this.changeContent, 1);
    // }


    playOnAuto() {
        if (!this.autoplay) {
            return;
        }

        const element = this.content[this.currentIndex];

        if (element.isVideo) {
            this.videoElement.play().catch(error => {
                console.warn('Автовоспроизведение заблокировано', error);
                return
            });
            /* Открой и почитай
            1. { once: true } - Если true, обработчик сработает только один раз, после чего автоматически удалится
            2. bind - первый аргумент функции контекст null - Контекст всего документа
            */
            //! Создаём привязанную функцию только один раз и сохраняем ссылку на неё
            /*
            Проблема была в том, что каждый вызов .bind() создаёт новую функцию.
            Теперь, сохраняя ссылку на созданную функцию, мы можем правильно её удалять,
            что предотвращает накопление обработчиков и множественные перелистывания.
            */
            this.boundChangeContent = this.changeContent.bind(this, 1);
            this.videoElement.addEventListener('ended', this.boundChangeContent, { once: true });

        } else {
            this.imageTimeout = setTimeout(() => {
                this.changeContent(1);
            }, 3000);
        }
    }

    changeMedia(index) {
        // todo Очищаем предыдущие таймер
        if (this.imageTimeout) {
            clearTimeout(this.imageTimeout);
            this.imageTimeout = null;
        }

        //! Правильно удаляем обработчик события, используя сохранённую ссылку на функцию
        if (this.boundChangeContent) {
            this.videoElement.removeEventListener('ended', this.boundChangeContent);
            this.boundChangeContent = null;
        }

        const elementContent = this.content[index];
        this.currentIndex = index;

        if (elementContent.isVideo) {
            // Настройка видео
            this.imageElement.classList.remove("active");
            this.imageElement.classList.add("exit");
            this.videoElement.classList.remove("active");
            this.videoElement.src = elementContent.src;
            this.videoElement.classList.remove("exit");
            setTimeout(() => {
                this.videoElement.classList.add("active");
            });
        }
        else {
            // Настройка изображения
            this.videoElement.classList.remove("active");
            this.videoElement.classList.add("exit");
            this.videoElement.pause();
            this.imageElement.classList.remove("active");
            this.imageElement.src = elementContent.src;
            this.imageElement.classList.remove("exit");
            setTimeout(() => {
                this.imageElement.classList.add("active");
            });
        }


        this.highlightCurrentThumbnail(index);
        if (this.autoplay) {
            this.playOnAuto();
        }
    }

    highlightCurrentThumbnail(index) {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.remove('active');
            if (i === index) {
                thumb.classList.add('active');
                thumb.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        });
    }

    toggleAutoplay() {
        this.autoplay = !this.autoplay;
        this.autoplayButton.classList.toggle('active', this.autoplay);
        if (this.autoplay) {
            this.playOnAuto();
        } else {
            this.videoElement.pause();
            //! Правильно удаляем обработчик события, используя сохранённую ссылку на функцию
            if (this.boundChangeContent) {
                this.videoElement.removeEventListener('ended', this.boundChangeContent);
                this.boundChangeContent = null;
            }
            if (this.imageTimeout) {
                clearTimeout(this.imageTimeout);
                this.imageTimeout = null;
            }
        }
    }
    changeContent(direction) {
        //*
        this.currentIndex = (this.currentIndex + direction + this.content.length) % this.content.length;
        this.changeMedia(this.currentIndex);
    }
}
