import cartReducer, { addToCart, removeFromCart, updateQuantity, clearCart, setDiscounts } from '../cartSlice';

describe('cartSlice', () => {
  const product = {
    uniqueItemId: 'p1',
    name: 'Test Product',
    MRP: 100,
    discountPercent: 20,
    discountedPrice: 80,
    quantity: 1,
  };

  it('should return the initial state', () => {
    const state = cartReducer(undefined, {});
    expect(state.items).toBeDefined();
    expect(state.totalQuantity).toBeDefined();
    expect(state.totalAmount).toBeDefined();
  });

  it('should handle addToCart', () => {
    const state = cartReducer(undefined, addToCart(product));
    expect(state.items.length).toBe(1);
    expect(state.items[0].uniqueItemId).toBe('p1');
    expect(state.totalQuantity).toBe(1);
  });

  it('should increase quantity if product already in cart', () => {
    const initial = { ...cartReducer(undefined, {}), items: [{ ...product, quantity: 1 }], discounts: [] };
    const state = cartReducer(initial, addToCart(product));
    expect(state.items[0].quantity).toBe(2);
  });

  it('should handle removeFromCart', () => {
    const initial = { ...cartReducer(undefined, {}), items: [{ ...product, quantity: 1 }], discounts: [] };
    const state = cartReducer(initial, removeFromCart('p1'));
    expect(state.items.length).toBe(0);
  });

  it('should handle updateQuantity', () => {
    const initial = { ...cartReducer(undefined, {}), items: [{ ...product, quantity: 1 }], discounts: [] };
    const state = cartReducer(initial, updateQuantity({ productId: 'p1', quantity: 3 }));
    expect(state.items[0].quantity).toBe(3);
  });

  it('should remove item if updateQuantity sets quantity to 0', () => {
    const initial = { ...cartReducer(undefined, {}), items: [{ ...product, quantity: 1 }], discounts: [] };
    const state = cartReducer(initial, updateQuantity({ productId: 'p1', quantity: 0 }));
    expect(state.items.length).toBe(0);
  });

  it('should handle clearCart', () => {
    const initial = { ...cartReducer(undefined, {}), items: [{ ...product, quantity: 2 }], discounts: [] };
    const state = cartReducer(initial, clearCart());
    expect(state.items.length).toBe(0);
    expect(state.totalQuantity).toBe(0);
    expect(state.totalAmount).toBe(0);
  });

  it('should handle setDiscounts and recalculate totals', () => {
    const discounts = [
      { minTotalCartValue: 50, discountPercentage: 10 },
      { minTotalCartValue: 100, discountPercentage: 20 },
    ];
    let state = cartReducer(undefined, addToCart(product));
    state = cartReducer(state, setDiscounts(discounts));
    expect(state.discounts.length).toBe(2);
    expect(state.cartDiscount.percentage).toBeGreaterThanOrEqual(0);
  });
});
