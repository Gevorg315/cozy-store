import './style.css';
import {
  addToCart,
  removeFromCart,
  setCartItemQuantity,
  type CartItem,
} from './cart/cart';
import { loadCart, saveCart } from './cart/cartStorage';
import type { Product } from './types/product';
import { products } from './data/products';
import { createAboutPage } from './pages/about';
import { createCartPage } from './pages/cart';
import { createCatalogPage } from './pages/catalog';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Application root element was not found.');
}

const createElement = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  className = '',
  text = '',
): HTMLElementTagNameMap[Tag] => {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
};

// Restore the cart when the application starts.
let cart: CartItem[] = loadCart(window.localStorage, products);

const header = createElement('header', 'site-header');

const logo = createElement('a', 'logo', 'cozy.');
logo.href = '#about';
logo.setAttribute('aria-label', 'Cozy Store home');

const navigation = createElement('nav', 'main-navigation');
navigation.setAttribute('aria-label', 'Main navigation');

const aboutButton = createElement('button', 'nav-button', 'About us');
aboutButton.type = 'button';

const shopButton = createElement('button', 'nav-button', 'Shop');
shopButton.type = 'button';

const cartButton = createElement('button', 'nav-button', 'Cart (0)');
cartButton.type = 'button';

navigation.append(aboutButton, shopButton, cartButton);
header.append(logo, navigation);

const main = createElement('main', 'main-content');

const footer = createElement(
  'footer',
  'site-footer',
  '© 2026 Cozy Store. Made with care.',
);

const updateCartButton = (): void => {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartButton.textContent = `Cart (${itemCount})`;
};

const persistCart = (): void => {
  saveCart(cart, window.localStorage);
};

const handleAddToCart = (product: Product): void => {
  cart = addToCart(cart, product);
  persistCart();
  updateCartButton();
};

const renderAboutPage = (): void => {
  main.replaceChildren(createAboutPage());
  aboutButton.classList.add('active');
  shopButton.classList.remove('active');
  cartButton.classList.remove('active');
};

const renderShopPage = (): void => {
  main.replaceChildren(createCatalogPage(handleAddToCart));
  aboutButton.classList.remove('active');
  shopButton.classList.add('active');
  cartButton.classList.remove('active');
};

const renderCartPage = (): void => {
  main.replaceChildren(
    createCartPage(cart, {
      onQuantityChange: (productId, quantity) => {
        cart = setCartItemQuantity(cart, productId, quantity);
        persistCart();
        updateCartButton();
        renderCartPage();
      },
      onRemove: (productId) => {
        cart = removeFromCart(cart, productId);
        persistCart();
        updateCartButton();
        renderCartPage();
      },
    }),
  );

  aboutButton.classList.remove('active');
  shopButton.classList.remove('active');
  cartButton.classList.add('active');
};

aboutButton.addEventListener('click', renderAboutPage);
shopButton.addEventListener('click', renderShopPage);
cartButton.addEventListener('click', renderCartPage);
logo.addEventListener('click', renderAboutPage);

app.append(header, main, footer);

updateCartButton();
renderAboutPage();
