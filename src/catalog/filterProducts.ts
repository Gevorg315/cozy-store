import type { Product } from '../types/product';

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const filterProducts = (
  products: Product[],
  filters: ProductFilters,
): Product[] => {
  const normalizedSearch = filters.search?.trim().toLowerCase() ?? '';

  return products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(normalizedSearch);

    const matchesCategory = !filters.category || filters.category === product.category;

    const matchesMinPrice =
      filters.minPrice === undefined || product.price >= filters.minPrice;

    const matchesMaxPrice =
      filters.maxPrice === undefined || product.price <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });
};
