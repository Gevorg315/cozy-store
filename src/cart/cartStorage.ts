import type { CartItem } from './cart';
import type { Product } from '../types/product';

const CART_STORAGE_KEY = 'cozy-store-cart';

interface SavedCartItem {
  productId: string;
  quantity: number;
}

export interface CartStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export const saveCart = (cart: CartItem[], storage: CartStorage): void => {
  const savedItems: SavedCartItem[] = cart.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
  }));

  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(savedItems));
  } catch {
    // Ignore storage errors so the cart can continue working in memory.
  }
};

export const loadCart = (
  storage: CartStorage,
  availableProducts: Product[],
): CartItem[] => {
  let savedData: string | null;

  try {
    savedData = storage.getItem(CART_STORAGE_KEY);
  } catch {
    return [];
  }

  if (!savedData) {
    return [];
  }

  try {
    const parsedData: unknown = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData.reduce<CartItem[]>((restoredCart, item: unknown) => {
      if (
        typeof item !== 'object' ||
        item === null ||
        !('productId' in item) ||
        !('quantity' in item)
      ) {
        return restoredCart;
      }

      const savedItem = item as SavedCartItem;

      if (
        typeof savedItem.productId !== 'string' ||
        !Number.isInteger(savedItem.quantity) ||
        savedItem.quantity <= 0
      ) {
        return restoredCart;
      }

      const product = availableProducts.find(
        (availableProduct) => availableProduct.id === savedItem.productId,
      );

      if (!product) {
        return restoredCart;
      }

      return [...restoredCart, { product, quantity: savedItem.quantity }];
    }, []);
  } catch {
    return [];
  }
};
