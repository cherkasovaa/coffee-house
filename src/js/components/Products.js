import { products } from '../data/products-list.js';
import Modal from './Modal.js';

export default class Products {
  #ACTIVE = 'tabs__item_active';
  #ACTIVE_OPTION = 'button__option_active';
  #loadMore = false;

  constructor() {
    this.elements = this.#queryElements();
    this.totalPrice = {
      base: 0,
      size: 0,
      additives: 0,
    };

    this.#init();
  }

  #init() {
    this.#bindEvents();
  }

  #queryElements() {
    return {
      tabs: document.querySelectorAll('.tabs__item'),
      stage: document.querySelector('.products-area'),
      area: document.querySelector('.products'),
      loadMoreButton: document.querySelector('.button__load-more'),
    };
  }

  #bindEvents() {
    window.addEventListener('load', (e) => this.#showProducts(e));
    window.addEventListener('resize', () => {
      if (document.documentElement.clientWidth >= 769) {
        this.#loadMore = true;

        const category = this.elements.area.getAttribute('aria-label');
        this.elements.area.append(...this.#createCards(category));

        this.elements.loadMoreButton.style.display = 'none';
      } else {
        this.#loadMore = false;

        const category = this.elements.area.getAttribute('aria-label');
        this.elements.area.append(...this.#createCards(category));
      }
    });
    this.elements.tabs.forEach((tab) =>
      tab.addEventListener('click', (e) => this.#changeCategory(e))
    );
    this.elements.loadMoreButton.addEventListener('click', (e) =>
      this.#onloadMore(e)
    );
  }

  #checkActiveTab(e) {
    const currentTab = e.currentTarget;
    const currentActiveTab = [...this.elements.tabs].filter((tab) =>
      tab.classList.contains(this.#ACTIVE)
    )[0];

    return currentTab === currentActiveTab;
  }

  #showActiveTab(e, category) {
    if (this.#checkActiveTab(e)) return;

    this.elements.tabs.forEach((tab) => tab.classList.remove(this.#ACTIVE));
    const currentTab = [...this.elements.tabs].filter(
      (tab) => tab.getAttribute('aria-label') === category
    )[0];
    currentTab.classList.add(this.#ACTIVE);
    this.#loadMore = false;
  }

  #showPopup = (data) => {
    this.elements.stage.insertAdjacentHTML(
      'beforebegin',
      new Modal(data).createPopup()
    );

    document.body.style.overflowY = 'hidden';

    this.#closeModal();
    this.#selectSize();
    this.#selectAdditives();
  };

  #calculatePrice(totalObject) {
    const price = document.querySelector('.modal__price');

    totalObject.base = parseFloat(price.ariaValueText);

    price.textContent =
      '$' +
      Object.values(totalObject)
        .reduce((sum, cur) => +sum + +cur, 0)
        .toFixed(2);
  }

  #selectCurrentSize = (e) => {
    const buttonSizes = document.querySelectorAll('.button__option.size');

    buttonSizes.forEach((button) => {
      button.classList.remove(this.#ACTIVE_OPTION);
    });

    e.currentTarget.classList.add(this.#ACTIVE_OPTION);

    this.totalPrice.size = parseFloat(e.currentTarget.ariaValueText);

    this.#calculatePrice(this.totalPrice);
  };

  #selectCurrentAdditive = (e) => {
    e.currentTarget.classList.toggle(this.#ACTIVE_OPTION);

    const currentValue = parseFloat(e.currentTarget.ariaValueText);

    e.currentTarget.classList.contains(this.#ACTIVE_OPTION)
      ? (this.totalPrice.additives += currentValue)
      : (this.totalPrice.additives -= currentValue);

    this.#calculatePrice(this.totalPrice);
  };

  #selectAdditives = () => {
    const buttons = document.querySelectorAll('.button__option.additives');

    buttons.forEach((button) => {
      button.addEventListener('click', this.#selectCurrentAdditive);
    });
  };

  #selectSize() {
    const buttonSizes = document.querySelectorAll('.button__option.size');

    buttonSizes.forEach((button) => {
      button.addEventListener('click', this.#selectCurrentSize);
    });
  }

  #closeModal() {
    const closeButton = document.querySelector('.button__close');
    const popup = document.querySelector('.modal');

    closeButton.addEventListener('click', () => {
      this.#hidePopup();
    });

    popup.addEventListener('click', (e) => {
      if (e.target.className === 'modal') {
        this.#hidePopup();
      }
    });

    this.totalPrice.size = 0;
    this.totalPrice.additives = 0;
    this.totalPrice.base = 0;
  }

  #hidePopup = () => {
    const popup = document.querySelector('.modal');

    popup.remove();
    document.body.style.overflowY = '';
  };

  #createProductCard(category, data) {
    const wrapper = document.createElement('div');
    wrapper.className = 'product-card';

    const imageWrapper = document.createElement('div');
    imageWrapper.className = `${wrapper.className}__image-wrapper`;

    const image = document.createElement('img');
    image.className = `${wrapper.className}__image`;
    image.src = `./assets/images/menu/${category}/${data.poster}.png`;
    image.setAttribute('alt', data.name);

    imageWrapper.append(image);

    const content = document.createElement('div');
    content.className = `${wrapper.className}__content`;

    const title = document.createElement('div');
    title.className = `${wrapper.className}__title`;
    title.innerText = data.name;

    const description = document.createElement('div');
    description.className = `${wrapper.className}__description`;
    description.innerText = data.description;

    const price = document.createElement('div');
    price.className = `${wrapper.className}__price`;
    price.textContent = `$${data.price}`;

    content.append(title);
    content.append(description);
    content.append(price);

    wrapper.append(imageWrapper);
    wrapper.append(content);

    wrapper.addEventListener('click', () => this.#showPopup(data));

    return wrapper;
  }

  #destroyCards(parent) {
    parent.replaceChildren();
  }

  #checkScreenWidth() {
    const screenWidth = document.documentElement.clientWidth;
    const isMobile = screenWidth <= 768;

    return isMobile;
  }

  #showLoadButton(list) {
    this.elements.loadMoreButton.style.display =
      !this.#loadMore && list.length > 4 ? 'flex' : 'none';
  }

  #createCards(category) {
    this.#destroyCards(this.elements.area);

    const list = products.filter((elem) => elem.category === category);

    if (this.#checkScreenWidth()) {
      this.#showLoadButton(list);
    }

    return Array(1)
      .fill(
        this.#checkScreenWidth() && !this.#loadMore
          ? list.filter((_, i) => i <= 3)
          : list
      )
      .flat(1)
      .map((card) => this.#createProductCard(category, card));
  }

  #changeCategory(e) {
    const category = e.currentTarget.ariaLabel;

    this.elements.area.setAttribute('aria-label', category);
    this.#showProducts(e);
  }

  #showProducts(e) {
    const category = this.elements.area.getAttribute('aria-label');
    this.#showActiveTab(e, category);

    this.elements.area.append(...this.#createCards(category));
  }

  #onloadMore() {
    this.#loadMore = true;

    const category = this.elements.area.getAttribute('aria-label');
    this.elements.area.append(...this.#createCards(category));
  }
}
