import type { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export const addToCart = (cart: CartItem[], product: Product): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    return cart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  return [...cart, { product, quantity: 1 }];
};

export const setCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  quantity: number,
): CartItem[] => {
  const safeQuantity = Math.max(1, Math.floor(quantity));

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity: safeQuantity } : item,
  );
};

export const removeFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

export const calculateCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};
