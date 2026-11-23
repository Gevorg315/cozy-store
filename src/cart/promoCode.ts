export const calculateDiscountedTotal = (total: number, promoCode: string): number => {
  const normalizedCode = promoCode.trim().toUpperCase();

  if (normalizedCode !== 'SALE10') {
    return total;
  }

  return Math.round((total * 0.9 + Number.EPSILON) * 100) / 100;
};
