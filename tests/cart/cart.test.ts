import { describe, expect, it } from 'vitest';
import {
  addToCart,
  calculateCartTotal,
  removeFromCart,
  setCartItemQuantity,
} from '../../src/cart/cart';
import type { Product } from '../../src/types/product';
import type { CartItem } from '../../src/cart/cart';

const mug: Product = {
  id: 'p001',
  name: 'Ceramic Mug',
  category: 'Kitchen',
  price: 18.99,
  description: 'A handmade ceramic mug',
};

const lamp: Product = {
  id: 'p002',
  name: 'Wooden Lamp',
  category: 'Lighting',
  price: 45,
  description: 'A wooden table lamp',
};

describe('shopping cart', () => {
  it('should add a new product to an empty cart', () => {
    expect(addToCart([], mug)).toEqual([{ product: mug, quantity: 1 }]);
  });

  it('should increase quantity when adding an existing product', () => {
    const cart: CartItem[] = [{ product: mug, quantity: 1 }];

    expect(addToCart(cart, mug)).toEqual([{ product: mug, quantity: 2 }]);
  });

  it('should add a different product as a separate item', () => {
    const cart: CartItem[] = [{ product: mug, quantity: 1 }];

    expect(addToCart(cart, lamp)).toEqual([
      { product: mug, quantity: 1 },
      { product: lamp, quantity: 1 },
    ]);
  });

  it('should update the quantity of an existing item', () => {
    const cart: CartItem[] = [{ product: mug, quantity: 1 }];

    expect(setCartItemQuantity(cart, 'p001', 3)).toEqual([{ product: mug, quantity: 3 }]);
  });

  it('should not allow quantity to become less than one', () => {
    const cart: CartItem[] = [{ product: mug, quantity: 2 }];

    expect(setCartItemQuantity(cart, 'p001', 0)).toEqual([{ product: mug, quantity: 1 }]);
  });

  it('should remove a product from the cart', () => {
    const cart: CartItem[] = [
      { product: mug, quantity: 1 },
      { product: lamp, quantity: 1 },
    ];

    expect(removeFromCart(cart, 'p001')).toEqual([{ product: lamp, quantity: 1 }]);
  });

  it('should calculate the total price of all cart items', () => {
    const cart: CartItem[] = [
      { product: mug, quantity: 2 },
      { product: lamp, quantity: 1 },
    ];

    expect(calculateCartTotal(cart)).toBeCloseTo(82.98);
  });

  it('should return zero for an empty cart', () => {
    expect(calculateCartTotal([])).toBe(0);
  });
});
