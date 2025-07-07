import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useCartDiscount = () => {
  const { subtotal, discount, discounts } = useSelector((state) => state.cart);

  const nextDiscountTier = useMemo(() => {
    if (!discounts.length) return null;

    const sortedDiscounts = [...discounts].sort((a, b) => a.minTotalCartValue - b.minTotalCartValue);
    
    for (const tier of sortedDiscounts) {
      if (subtotal < tier.minTotalCartValue) {
        return {
          ...tier,
          amountNeeded: tier.minTotalCartValue - subtotal
        };
      }
    }
    
    return null;
  }, [subtotal, discounts]);

  const discountSavings = useMemo(() => {
    return discount.discountAmount || 0;
  }, [discount]);

  return {
    currentDiscount: discount,
    nextDiscountTier,
    discountSavings,
    hasDiscount: discount.percentage > 0
  };
};