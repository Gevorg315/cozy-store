import { describe, expect, it } from 'vitest';
import { sortProducts } from '../../src/catalog/sortProducts';
import type { Product } from '../../src/types/product';

const products: Product[] = [
  {
    id: 'p001',
    name: 'Ceramic Mug',
    category: 'Kitchen',
    price: 18.99,
    description: 'A ceramic mug',
  },
  {
    id: 'p002',
    name: 'Wooden Lamp',
    category: 'Lighting',
    price: 45,
    description: 'A wooden lamp',
  },
  {
    id: 'p003',
    name: 'Cotton Blanket',
    category: 'Home',
    price: 35,
    description: 'A cotton blanket',
  },
];

describe('sortProducts', () => {
  it('should preserve the original order by default', () => {
    expect(sortProducts(products, 'default')).toEqual(products);
  });

  it('should sort products by price from low to high', () => {
    expect(sortProducts(products, 'price-asc')).toEqual([
      products[0],
      products[2],
      products[1],
    ]);
  });

  it('should sort products by price from high to low', () => {
    expect(sortProducts(products, 'price-desc')).toEqual([
      products[1],
      products[2],
      products[0],
    ]);
  });

  it('should not modify the original products array', () => {
    const originalProducts = [...products];

    sortProducts(products, 'price-asc');

    expect(products).toEqual(originalProducts);
  });
});
