import { describe, expect, it } from 'vitest';
import { products } from '../../src/data/products';
import { loadCart, saveCart } from '../../src/cart/cartStorage';
import type { CartItem } from '../../src/cart/cart';

const createStorage = () => {
  const data = new Map<string, string>();

  return {
    getItem: (key: string): string | null => data.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      data.set(key, value);
    },
  };
};

describe('cart storage', () => {
  it('should save cart product IDs and quantities', () => {
    const storage = createStorage();
    const cart: CartItem[] = [{ product: products[0], quantity: 2 }];

    saveCart(cart, storage);

    expect(storage.getItem('cozy-store-cart')).toBe(
      JSON.stringify([{ productId: products[0].id, quantity: 2 }]),
    );
  });

  it('should restore saved cart items', () => {
    const storage = createStorage();

    storage.setItem(
      'cozy-store-cart',
      JSON.stringify([{ productId: products[0].id, quantity: 3 }]),
    );

    expect(loadCart(storage, products)).toEqual([{ product: products[0], quantity: 3 }]);
  });

  it('should return an empty cart when nothing is saved', () => {
    const storage = createStorage();

    expect(loadCart(storage, products)).toEqual([]);
  });

  it('should return an empty cart when saved JSON is invalid', () => {
    const storage = createStorage();
    storage.setItem('cozy-store-cart', 'invalid JSON');

    expect(loadCart(storage, products)).toEqual([]);
  });

  it('should ignore products that no longer exist', () => {
    const storage = createStorage();

    storage.setItem(
      'cozy-store-cart',
      JSON.stringify([{ productId: 'unknown-product', quantity: 2 }]),
    );

    expect(loadCart(storage, products)).toEqual([]);
  });

  it('should ignore invalid quantities', () => {
    const storage = createStorage();

    storage.setItem(
      'cozy-store-cart',
      JSON.stringify([
        { productId: products[0].id, quantity: 0 },
        { productId: products[1].id, quantity: -2 },
      ]),
    );

    expect(loadCart(storage, products)).toEqual([]);
  });
});
