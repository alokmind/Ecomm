import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProductsAndCategories = createAsyncThunk(
    'products/fetchProductsAndCategories',
    async () => {
        const [productsRes, categoriesRes] = await Promise.all([
            axios.get('/data/products.json'),
            axios.get('/data/categories.json'),
        ]);
        return {
            products: productsRes.data,
            categories: categoriesRes.data,
        };
    }
);

const initialState = {
    items: [],
    categories: [],
    selectedCategoryID: 'all',
    searchTerm: '',
    status: 'idle',
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setSelectedCategoryID: (state, action) => {
            state.selectedCategoryID = action.payload;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        resetProducts: (state) => {
            state.selectedCategoryID = 'all';
            state.searchTerm = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsAndCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProductsAndCategories.fulfilled, (state, action) => {
                state.items = action.payload.products;
                // Add 'All' to beginning:
                state.categories = [{ categoryName: 'All' }, ...action.payload.categories];
                state.status = 'succeeded';
            })
            .addCase(fetchProductsAndCategories.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { setSelectedCategoryID, setSearchTerm, resetProducts } = productsSlice.actions;

export default productsSlice.reducer;
