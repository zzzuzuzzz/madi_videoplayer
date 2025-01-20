let scrollArg = { behavior: 'smooth', block: 'start' }

export default class CardRender {

    constructor(db) {
        this.db = db
        this.selectItem = 0;
        this.autoplay = false;
        this.repet = true;
        this.selectItemType = null;

        this.container = document.getElementById('cards-container');
        this.swiperContainer = document.getElementById('swiper-wrapper-container');
        this.navigationContainer = document.getElementById('navigation-container');
        this.cardsContainer = document.getElementById('cards-container')

        this.setBorderPoints()
    }
    setBorderPoints() {
        this.startItem = this.db[0].id;
        this.endItem = this.db[this.db.length - 1].id;
    }
    clearElement(element) {
        element.innerHTML = '';
    }
    renderCards() {
        this.clearElement(this.container)

        this.db.forEach(item => {
            const cardHTML = `
                    <div class="card" data-card-id="${item.id}" data-card-type="${item.type}">
                        <img class="card-img" src="/assets/images/${item.path}.png" alt="${item.title}">
                        <p>${item.title}</p>
                        <p>${item.description}</p>
                    </div>
                    `;
            this.container.insertAdjacentHTML('beforeend', cardHTML);
        });

        this.addCardClickListeners();
    }
    addCardClickListeners() {
        document.querySelectorAll(`#cards-container .card`).forEach(card => {
            card.addEventListener('click', () => {
                this.selectItem = card.dataset.cardId;
                this.selectItemType = card.dataset.cardType;
                this.renderSwiper();
            });
        });
    }
    startTimer(delay) {
        setTimeout(() => {
            this.changeItem()
        }, delay)
    }
    buttonSlideItem(arg)
    {
        this.changeItem(arg)
    }
    renderSwiper() {
        document.querySelectorAll('.hidden').forEach(item => {item.classList.remove('hidden')})

        this.clearElement(this.cardsContainer)
        this.clearElement(this.swiperContainer)
        this.clearElement(this.navigationContainer)

        let swiperSlides = this.db.map( item => {
            let content = ``;
            if (item.type === 'video') {
                content = `<video class="card-img" data-card-id="${item.id}" data-card-type="${item.type}" src="/assets/videos/${item.path}.mp4" controls>`
            } else if (item.type === 'img') {
                content = `<img class="card-img" data-card-id="${item.id}" data-card-type="${item.type}" src="/assets/images/${item.path}.png">`
            }
            return `
                      <div class="swiper-slide" data-card-id="${item.id}" data-card-type="${item.type}">
                        <div class="card">
                          ${content}
                          <p>${item.title}</p>
                          <p>${item.description}</p>
                        </div>
                      </div>
                    `
        }).join('');
        let navigationItems = this.db.map( item => {
            let content = ``;
            if (item.id === this.selectItem) {
                content = `<div class="navigation-item activeSidebarItem" data-card-id="${item.id}" data-card-type="${item.type}">`
            } else {
                content = `<div class="navigation-item" data-card-id="${item.id}" data-card-type="${item.type}">`
            }
            return `
                    ${content}
                        <p>${item.title}</p>
                        <img src="/assets/images/${item.path}.png" class="card-img-mini">
                    </div>
                `
        }).join('');

        this.swiperContainer.innerHTML = swiperSlides;
        this.navigationContainer.innerHTML = navigationItems;

        let navCard = document.querySelector('#navigation-container [data-card-id="'+this.selectItem+'"]')
        let cardIds = document.querySelector('[data-card-id="'+this.selectItem+'"]')

        cardIds.scrollIntoView(scrollArg)
        navCard.scrollIntoView(scrollArg)

        document.querySelectorAll("video").forEach(item => {
            item.addEventListener('ended', () => {
                this.changeItem()
            })
        });

        document.getElementById('swiper-button-prev').addEventListener('click', this.buttonSlideItem.bind(this, '-'))
        document.getElementById('swiper-button-next').addEventListener('click', this.buttonSlideItem.bind(this, '+'))

        document.querySelector(`#navigation-container`).addEventListener('click', e => {
            if (e.target.dataset.cardId == undefined) {
                return
            }

            this.selectItem = e.target.dataset.cardId;
            this.selectItemType = e.target.dataset.cardType;

            document.querySelectorAll('#navigation-container .navigation-item').forEach(item => item.classList.remove('activeSidebarItem'));

            let navItem = document.querySelector(`#navigation-container .navigation-item[data-card-id="${this.selectItem}"]`)
            navItem.classList.add('activeSidebarItem');
            navItem.scrollIntoView(scrollArg)
            cardIds.scrollIntoView(scrollArg)
        });

        let btnBtn = document.getElementById('btn-btn')
        btnBtn.addEventListener('click', e => {
            let card = document.querySelector('.card-img[data-card-id="'+this.selectItem+'"]')
            if (this.autoplay) {
                this.autoplay = false
                try {
                    card.pause()
                } catch {}
                btnBtn.style.backgroundColor = 'red'
            } else {
                this.autoplay = true;
                if (this.selectItemType === 'video') {
                    card.play()
                } else {
                    this.startTimer(5000)
                }
                btnBtn.style.backgroundColor = 'green'
            }
        })

        let repetBtn = document.getElementById('repet-btn');
        repetBtn.addEventListener('click', e => {
            if (this.repet) {
                this.repet = false
                repetBtn.style.backgroundColor = 'red'
            } else {
                this.repet = true;
                repetBtn.style.backgroundColor = 'green'
            }
        })

        document.getElementById('relode').addEventListener('click', e => {
            window.location.reload()
        })
    }
    plusItem() {
        if (this.selectItem == this.endItem) {
            if (this.repet) {
                this.selectItem = this.startItem
                this.selectItemType = this.db[this.selectItem - 1].type
            }
        } else {
            this.selectItem++
            this.selectItemType = this.db[this.selectItem - 1].type
        }
    }
    minusItem() {
        if (this.selectItem == this.startItem) {
            if (this.repet) {
                this.selectItem = this.endItem
                this.selectItemType = this.db[this.selectItem - 1].type
            }
        } else {
            this.selectItem--
            this.selectItemType = this.db[this.selectItem - 1].type
        }
    }
    changeItem(fun = '+') {
        if (this.selectItemType === 'video') {
            document.querySelector('.card-img[data-card-id="'+this.selectItem+'"]').pause()
        }
        document.querySelectorAll(`.navigation-item`).forEach(item => {
            item.classList.remove('activeSidebarItem')
        })

        if (fun == '-') {
            this.minusItem();
        } else {
            this.plusItem();
        }

        if (this.selectItemType === 'img') {
            this.startTimer(5000)
        }

        document.querySelector('[data-card-id="'+this.selectItem+'"]').scrollIntoView(scrollArg)

        let nav = document.querySelector(`#navigation-container .navigation-item[data-card-id="${this.selectItem}"]`)
        nav.scrollIntoView(scrollArg)
        nav.classList.add('activeSidebarItem')

        if (this.selectItemType === 'video') {
            document.querySelector('.card-img[data-card-id="'+this.selectItem+'"]').play()
        }
    }
}