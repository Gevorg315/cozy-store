import { calculateCartTotal, type CartItem } from '../cart/cart';
import { calculateDiscountedTotal } from '../cart/promoCode';

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

export interface CartPageCallbacks {
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const createCartPage = (
  cart: CartItem[],
  callbacks: CartPageCallbacks,
): HTMLElement => {
  const section = createElement('section', 'cart-page');

  const heading = createElement('h1', 'cart-title', 'Your shopping cart');

  if (cart.length === 0) {
    const emptyMessage = createElement(
      'p',
      'empty-cart-message',
      'Your cart is empty. Find something cozy for your home!',
    );

    section.append(heading, emptyMessage);
    return section;
  }

  const itemsList = createElement('div', 'cart-items');

  cart.forEach((item) => {
    const row = createElement('article', 'cart-item');

    const productInfo = createElement('div', 'cart-product-info');
    const name = createElement('h2', 'cart-product-name', item.product.name);
    const price = createElement(
      'p',
      'cart-product-price',
      `$${item.product.price.toFixed(2)} each`,
    );

    productInfo.append(name, price);

    const quantityControls = createElement('div', 'quantity-controls');

    const decreaseButton = createElement('button', 'quantity-button', '−');
    decreaseButton.type = 'button';
    decreaseButton.setAttribute('aria-label', `Decrease ${item.product.name} quantity`);
    decreaseButton.disabled = item.quantity <= 1;
    decreaseButton.addEventListener('click', () => {
      callbacks.onQuantityChange(item.product.id, item.quantity - 1);
    });

    const quantity = createElement('span', 'cart-quantity', String(item.quantity));

    const increaseButton = createElement('button', 'quantity-button', '+');
    increaseButton.type = 'button';
    increaseButton.setAttribute('aria-label', `Increase ${item.product.name} quantity`);
    increaseButton.addEventListener('click', () => {
      callbacks.onQuantityChange(item.product.id, item.quantity + 1);
    });

    quantityControls.append(decreaseButton, quantity, increaseButton);

    const itemTotal = createElement(
      'p',
      'cart-item-total',
      `$${(item.product.price * item.quantity).toFixed(2)}`,
    );

    const removeButton = createElement('button', 'remove-button', 'Remove');
    removeButton.type = 'button';
    removeButton.addEventListener('click', () => {
      callbacks.onRemove(item.product.id);
    });

    const itemActions = createElement('div', 'cart-item-actions');
    itemActions.append(itemTotal, removeButton);

    row.append(productInfo, quantityControls, itemActions);
    itemsList.append(row);
  });

  const summary = createElement('section', 'cart-summary');
  const summaryHeading = createElement('h2', '', 'Order summary');

  const subtotal = calculateCartTotal(cart);

  const subtotalRow = createElement('div', 'summary-row');
  const subtotalLabel = createElement('span', '', 'Subtotal');
  const subtotalValue = createElement(
    'span',
    'subtotal-value',
    `$${subtotal.toFixed(2)}`,
  );

  subtotalRow.append(subtotalLabel, subtotalValue);

  const promoSection = createElement('div', 'promo-section');
  const promoLabel = createElement('label', '', 'Promo code');
  promoLabel.htmlFor = 'promo-code';

  const promoControls = createElement('div', 'promo-controls');
  const promoInput = createElement('input', 'filter-input');
  promoInput.id = 'promo-code';
  promoInput.type = 'text';
  promoInput.placeholder = 'Enter SALE10';

  const applyButton = createElement('button', 'apply-promo-button', 'Apply');
  applyButton.type = 'button';

  const promoMessage = createElement('p', 'promo-message');
  const totalRow = createElement('div', 'summary-row total-row');
  const totalLabel = createElement('strong', '', 'Total');
  const totalValue = createElement('strong', 'total-value', `$${subtotal.toFixed(2)}`);

  totalRow.append(totalLabel, totalValue);
  promoControls.append(promoInput, applyButton);
  promoSection.append(promoLabel, promoControls, promoMessage);

  applyButton.addEventListener('click', () => {
    const code = promoInput.value.trim();

    if (!code) {
      promoMessage.textContent = 'Please enter a promo code.';
      promoMessage.className = 'promo-message error';
      totalValue.textContent = `$${subtotal.toFixed(2)}`;
      return;
    }

    const discountedTotal = calculateDiscountedTotal(subtotal, code);

    if (code.toUpperCase() === 'SALE10') {
      promoMessage.textContent = 'Success! 10% discount applied.';
      promoMessage.className = 'promo-message success';
    } else {
      promoMessage.textContent = 'Invalid promo code. No discount applied.';
      promoMessage.className = 'promo-message error';
    }

    totalValue.textContent = `$${discountedTotal.toFixed(2)}`;
  });

  summary.append(summaryHeading, subtotalRow, promoSection, totalRow);

  section.append(heading, itemsList, summary);

  return section;
};
