import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: localStorage.getItem('name') || '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.name = action.payload;
      localStorage.setItem('name', action.payload);
    },
    logout: (state) => {
      state.name = '';
      localStorage.removeItem('name');
    },
  },
});

export const { setUserName, logout } = userSlice.actions;

export default userSlice.reducer;
