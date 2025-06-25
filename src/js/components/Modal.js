export default class Modal {
  constructor(data) {
    this.data = data;

    this.getName = function () {
      return this.data.name;
    };

    this.getDescription = function () {
      return this.data.description;
    };

    this.getPrice = function () {
      return this.data.price;
    };

    this.getSize = function () {
      return this.data.sizes;
    };

    this.getAdditives = function () {
      return this.data.additives;
    };

    this.setAdditives = function () {
      const additives = this.getAdditives();
      let text = '';
      let count = 1;

      for (let additive of additives) {
        text += `<div class="button__option additives" aria-label="${additive.name}-additive" aria-valuetext="${additive['add-price']}">
                      <span class="button__option-icon">${count}</span>
                      <span class="button__option-text">${additive.name}</span>
                    </div>`;

        count++;
      }

      return text;
    };

    this.setSizes = function () {
      const sizes = this.getSize();
      let text = '';

      let count = 1;

      for (let key in sizes) {
        if (count === 1) {
          text += `<div class="button__option button__option_active size" aria-label="${key}-size" aria-valuetext="${
            sizes[key]['add-price']
          }">
                        <span class="button__option-icon">${key.toUpperCase()}</span>
                        <span class="button__option-text">${sizes[key].size}</span>
                      </div>`;

          count++;
        } else {
          text += `<div class="button__option size" aria-label="${key}-size" aria-valuetext="${
            sizes[key]['add-price']
          }">
                          <span class="button__option-icon">${key.toUpperCase()}</span>
                          <span class="button__option-text">${sizes[key].size}</span>
                        </div>`;
        }
      }

      return text;
    };

    this.createPopup = function () {
      const node = `<div class="modal">
            <div class="modal-card">
              <div class="modal-card__poster" style="background-image:url(./assets/images/menu/${this.data.category}/${
                this.data.poster
              }.png)"></div>
              <div class="modal-card__content">
                <h3 class="modal-card__title">${this.getName()}</h3>
                <p class="modal-card__description">${this.getDescription()}</p>

                <div class="modal-card__size-section">
                  <h4 class="modal-card__size-section-title">Size</h4>
                  <div class="modal-card__sizes button">
                  ${this.setSizes()}
                  </div>
                </div>


                <div class="modal-card__additives-section">
                  <h4 class="modal-card__additives-section-title">Additives</h4>
                  <div class="modal-card__additives button">
                    ${this.setAdditives()}
                  </div>
                </div>

                <div class="modal-card__price-section">
                  <span class="modal__price-title">Total:</span>
                  <span class="modal__price" aria-valuetext=${this.getPrice()}>$${this.getPrice()}</span>
                </div>

                <div class="modal-card__alert">
                  The cost is not final. Download our mobile app to see the final price and place your order. Earn
                  loyalty points and
                  enjoy your favorite coffee with up to 20% discount.
                </div>

                <a href="#" class="button button__close">
                  <span class="button__close-text">Close</span>
                </a>
              </div>
            </div>
          </div>`;

      return node;
    };
  }
}
