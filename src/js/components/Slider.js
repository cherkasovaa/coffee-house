export default class Slider {
  constructor(container) {
    this.container = container;
    this.elements = this.#queryElements();
    this.options = {
      slideIdx: 0,
      timer: null,
      duration: 250,
    };
    this.position = {
      x: 0,
      y: 0,
    };
    this.#init();
  }

  #init() {
    this.#bindEvents();
    this.#startSlider();
  }

  #queryElements() {
    return {
      prevButton: document.querySelector('.slider__arrow-left'),
      nextButton: document.querySelector('.slider__arrow-right'),
      slider: document.querySelector('.slider__inner'),
      track: document.querySelector('.slider__wrapper'),
      controls: document.querySelector('.slider__controls'),
      dots: document.querySelector('.slider__indicators'),
      slides: document.querySelectorAll('.slide'),
    };
  }

  #bindEvents() {
    const interactiveElements = [this.elements.track, this.elements.controls];

    interactiveElements.forEach((element) => {
      if (!element) return;

      element.addEventListener('mousedown', (e) => this.#pauseSliderOnHover(e));
      element.addEventListener('mouseup', (e) => this.#swipeSlider(e));
      element.addEventListener('mouseover', () =>
        clearInterval(this.options.timer)
      );
      element.addEventListener('mouseout', () => this.#startSlider());
    });

    this.elements.slider.addEventListener('touchstart', (e) =>
      this.#pauseSliderOnHover(e.touches[0])
    );
    this.elements.slider.addEventListener('touchend', (e) =>
      this.#swipeSlider(e.changedTouches[0])
    );

    this.elements.prevButton.addEventListener('click', () => {
      this.elements.dots.children[this.options.slideIdx].value = '0';
      this.#goTo(this.options.slideIdx - 1);
    });

    this.elements.nextButton.addEventListener('click', () => {
      this.elements.dots.children[this.options.slideIdx].value = '0';
      this.#goTo(this.options.slideIdx + 1);
    });
  }

  #moveTo() {
    const slidesLength = this.elements.slides.length;

    const offset =
      (this.elements.slider.scrollWidth / slidesLength) * this.options.slideIdx;
    this.elements.slider.style.transform = `translateX(-${offset}px)`;
  }

  #changeIndicator(index, value) {
    this.elements.dots.children[index].value =
      value + +this.elements.dots.children[index].value + '';
  }

  #activeDot(ind) {
    this.options.timer = setInterval(() => {
      this.#changeIndicator(ind, 5);

      if (this.elements.dots.children[ind].value === '100') {
        this.elements.dots.children[ind].value = '0';

        this.#goTo(this.options.slideIdx + 1);
      }
    }, this.options.duration);
  }

  #goTo(index) {
    this.options.slideIdx = index;

    if (index > this.elements.slides.length - 1) {
      this.options.slideIdx = 0;
    }

    if (index < 0) {
      this.options.slideIdx = this.elements.slides.length - 1;
    }

    clearInterval(this.options.timer);
    this.#activeDot(this.options.slideIdx);

    this.#moveTo();
  }

  #startSlider() {
    this.#goTo(this.options.slideIdx);
  }

  #swipe() {
    const distance = 70;

    this.elements.dots.children[this.options.slideIdx].value = '0';

    if (this.position.x - this.position.y > distance) {
      this.#goTo(this.options.slideIdx + 1);
    }

    if (this.position.x - this.position.y < -distance) {
      this.#goTo(this.options.slideIdx - 1);
    }
  }

  #pauseSliderOnHover(e) {
    this.position.x = e.clientX;
    clearInterval(this.options.timer);
  }

  #swipeSlider(e) {
    this.position.y = e.clientX;
    this.#swipe();
    this.#startSlider();
  }
}
