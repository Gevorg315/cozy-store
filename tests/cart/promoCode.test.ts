import { describe, expect, it } from 'vitest';
import { calculateDiscountedTotal } from '../../src/cart/promoCode';

describe('calculateDiscountedTotal', () => {
  it('should apply a 10% discount for SALE10', () => {
    expect(calculateDiscountedTotal(100, 'SALE10')).toBe(90);
  });

  it('should recognize the promo code without case sensitivity', () => {
    expect(calculateDiscountedTotal(100, 'sale10')).toBe(90);
  });

  it('should ignore whitespace around the promo code', () => {
    expect(calculateDiscountedTotal(100, ' SALE10 ')).toBe(90);
  });

  it('should not apply a discount for an invalid promo code', () => {
    expect(calculateDiscountedTotal(100, 'WELCOME')).toBe(100);
  });

  it('should return the original total when no promo code is provided', () => {
    expect(calculateDiscountedTotal(100, '')).toBe(100);
  });

  it('should round the discounted total to two decimal places', () => {
    expect(calculateDiscountedTotal(82.98, 'SALE10')).toBe(74.68);
  });
});
