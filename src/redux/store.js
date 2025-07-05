import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import productsReducer from './slices/productsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    // add others here later
  },
});
