import type { Product } from '../types/product';

export type SortOption = 'default' | 'price-asc' | 'price-desc';

export const sortProducts = (products: Product[], sortOption: SortOption): Product[] => {
  switch (sortOption) {
    case 'price-asc':
      return [...products].sort((a, b) => a.price - b.price);

    case 'price-desc':
      return [...products].sort((a, b) => b.price - a.price);

    case 'default':
    default:
      return [...products];
  }
};
