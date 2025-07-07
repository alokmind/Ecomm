import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem('cart', serializedCart);
  } catch (err) {
    console.error('Could not save cart to localStorage', err);
  }
};

// Function to load cart discounts
const loadCartDiscounts = async () => {
  try {
    const response = await fetch('/data/cartDiscount.json');
    const discounts = await response.json();
    return discounts.sort((a, b) => b.minTotalCartValue - a.minTotalCartValue); // Sort descending
  } catch (err) {
    console.error('Could not load cart discounts', err);
    return [];
  }
};

// Function to calculate applicable discount
const calculateDiscount = (cartValue, discounts) => {
  for (const discount of discounts) {
    if (cartValue >= discount.minTotalCartValue) {
      return {
        percentage: discount.discountPercentage,
        minValue: discount.minTotalCartValue,
        discountAmount: (cartValue * discount.discountPercentage) / 100
      };
    }
  }
  return {
    percentage: 0,
    minValue: 0,
    discountAmount: 0
  };
};

// Function to recalculate cart totals with discount
const recalculateCartTotals = (items, discounts = []) => {
  const subtotal = items.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  
  const discount = calculateDiscount(subtotal, discounts);
  const totalAmount = subtotal - discount.discountAmount;
  
  return {
    totalQuantity,
    subtotal,
    discount,
    totalAmount
  };
};

const initialCartItems = loadCartFromStorage();
const initialTotals = recalculateCartTotals(initialCartItems);

const initialState = {
  items: initialCartItems,
  totalQuantity: initialTotals.totalQuantity,
  subtotal: initialTotals.subtotal,
  discount: initialTotals.discount,
  totalAmount: initialTotals.totalAmount,
  discounts: [], // Will be loaded asynchronously
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setDiscounts: (state, action) => {
      state.discounts = action.payload;
      // Recalculate totals with new discounts
      const totals = recalculateCartTotals(state.items, state.discounts);
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.totalAmount = totals.totalAmount;
    },
    addToCart: (state, action) => {
      const product = action.payload;
      const discountedPrice = product.MRP - (product.MRP * product.discountPercent) / 100;
      
      const existingItem = state.items.find(item => item.uniqueItemId === product.uniqueItemId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
          discountedPrice: discountedPrice,
        });
      }
      
      // Recalculate totals with discount
      const totals = recalculateCartTotals(state.items, state.discounts);
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.totalAmount = totals.totalAmount;
      
      // Save to localStorage
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.uniqueItemId !== productId);
      
      // Recalculate totals with discount
      const totals = recalculateCartTotals(state.items, state.discounts);
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.totalAmount = totals.totalAmount;
      
      // Save to localStorage
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.uniqueItemId !== productId);
      } else {
        const item = state.items.find(item => item.uniqueItemId === productId);
        if (item) {
          item.quantity = quantity;
        }
      }
      
      // Recalculate totals with discount
      const totals = recalculateCartTotals(state.items, state.discounts);
      state.totalQuantity = totals.totalQuantity;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.totalAmount = totals.totalAmount;
      
      // Save to localStorage
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.subtotal = 0;
      state.discount = { percentage: 0, minValue: 0, discountAmount: 0 };
      state.totalAmount = 0;
      
      // Clear localStorage
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setDiscounts } = cartSlice.actions;

// Async thunk to load discounts
export const loadDiscounts = () => async (dispatch) => {
  try {
    const discounts = await loadCartDiscounts();
    dispatch(setDiscounts(discounts));
  } catch (error) {
    console.error('Failed to load discounts:', error);
  }
};

export default cartSlice.reducer;