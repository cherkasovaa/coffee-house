import BurgerMenu from './components/BurgerMenu';
import Products from './components/Products';
import Slider from './components/Slider';

const burgerContainer = document.querySelector('.burger-menu');
if (burgerContainer) new BurgerMenu(burgerContainer);

const slider = document.querySelector('.slider');
if (slider) new Slider(slider);

const products = document.querySelector('.products');
if (products) new Products();
