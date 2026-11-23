import { describe, expect, it } from 'vitest';
import { filterProducts } from '../../src/catalog/filterProducts';
import type { Product } from '../../src/types/product';

const products: Product[] = [
  {
    id: 'p001',
    name: 'Ceramic Mug',
    category: 'Kitchen',
    price: 18.99,
    description: 'Handmade ceramic mug',
  },
  {
    id: 'p002',
    name: 'Wooden Lamp',
    category: 'Lighting',
    price: 45,
    description: 'Warm wooden table lamp',
  },
  {
    id: 'p003',
    name: 'Cozy Blanket',
    category: 'Home',
    price: 35,
    description: 'Soft cotton blanket',
  },
];

describe('filterProducts', () => {
  it('should return all products when no filters are applied', () => {
    expect(filterProducts(products, {})).toEqual(products);
  });

  it('should search by product name without case sensitivity', () => {
    expect(filterProducts(products, { search: 'mUG' })).toEqual([products[0]]);
  });

  it('should filter products by category', () => {
    expect(filterProducts(products, { category: 'Kitchen' })).toEqual([products[0]]);
  });

  it('should filter products by an inclusive price range', () => {
    expect(
      filterProducts(products, {
        minPrice: 18.99,
        maxPrice: 35,
      }),
    ).toEqual([products[0], products[2]]);
  });

  it('should combine search, category, and price filters', () => {
    expect(
      filterProducts(products, {
        search: 'wood',
        category: 'Lighting',
        minPrice: 40,
        maxPrice: 50,
      }),
    ).toEqual([products[1]]);
  });

  it('should return an empty array when no products match', () => {
    expect(filterProducts(products, { search: 'sofa' })).toEqual([]);
  });
});
