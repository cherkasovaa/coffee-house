export default class BurgerMenu {
  #activeClass = 'burger-menu_active';

  constructor(container) {
    this.container = container;

    this.elements = this.#queryElements();
    this.#init();
  }

  #init() {
    this.#bindEvents();
  }

  #queryElements() {
    return {
      list: document.querySelector('.navigation'),
      items: document.querySelectorAll('.navigation__link'),
      menu: document.querySelector('.coffee-menu'),
    };
  }

  #bindEvents() {
    this.container.addEventListener('click', () => this.#activateMenu());
    this.elements.menu.addEventListener('click', () => this.#activateMenu());
    this.elements.items.forEach((item) =>
      item.addEventListener('click', () => this.#activateMenu())
    );
    window.addEventListener('resize', () => this.#onResize());
  }

  #onResize() {
    const screenWIdth = document.documentElement.clientWidth;
    const isDesktop = screenWIdth >= 768;
    if (isDesktop) {
      this.#hideMenu();
    }
  }

  #isActiveMenu() {
    return this.container.classList.contains(this.#activeClass);
  }

  #showMenu(shift) {
    document.body.style.overflow = 'hidden';
    this.container.classList.add(this.#activeClass);
    this.elements.list.style.transform = `translateX(-${shift}%)`;
  }

  #hideMenu() {
    document.body.style.overflow = '';
    this.container.classList.remove(this.#activeClass);
    this.elements.list.style.removeProperty('transform');
  }

  #getShift() {
    const screenWIdth = document.documentElement.clientWidth;
    const isMobileScreen = screenWIdth <= 380;

    const shift = isMobileScreen ? 7 : 4;

    return shift;
  }

  #activateMenu() {
    if (this.#isActiveMenu()) {
      this.#hideMenu();
    } else {
      const shift = this.#getShift();

      this.#showMenu(shift);
    }
  }
}
