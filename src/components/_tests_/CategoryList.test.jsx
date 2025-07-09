import { render, screen, fireEvent } from '@testing-library/react';
import CategoryList from '../CategoryList';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer, { setSelectedCategoryID } from '../../redux/slices/productsSlice';

describe('CategoryList', () => {
  const initialState = {
    products: {
      categories: [
        { uniqueCategoryID: 'all', categoryName: 'All' },
        { uniqueCategoryID: 'cat1', categoryName: 'Electronics' },
        { uniqueCategoryID: 'cat2', categoryName: 'Clothing' },
      ],
      selectedCategoryID: 'all',
    },
  };

  function renderWithStore(state = initialState) {
    const store = configureStore({ reducer: { products: productsReducer }, preloadedState: state });
    return render(
      <Provider store={store}>
        <CategoryList />
      </Provider>
    );
  }

  it('renders category list and highlights "All" by default', () => {
    renderWithStore();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('All')).toHaveStyle('background-color: #007bff');
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
  });

  it('highlights the selected category', () => {
    const state = {
      products: {
        ...initialState.products,
        selectedCategoryID: 'cat2',
      },
    };
    renderWithStore(state);
    expect(screen.getByText('Clothing')).toHaveStyle('background-color: #007bff');
  });

  it('calls setSelectedCategoryID when a category is clicked', () => {
    const store = configureStore({ reducer: { products: productsReducer }, preloadedState: initialState });
    render(
      <Provider store={store}>
        <CategoryList />
      </Provider>
    );
    fireEvent.click(screen.getByText('Electronics'));
    expect(store.getState().products.selectedCategoryID).toBe('cat1');
  });

  it('calls onCategoryClick prop if provided', () => {
    const store = configureStore({ reducer: { products: productsReducer }, preloadedState: initialState });
    const onCategoryClick = jest.fn();
    render(
      <Provider store={store}>
        <CategoryList onCategoryClick={onCategoryClick} />
      </Provider>
    );
    fireEvent.click(screen.getByText('Clothing'));
    expect(onCategoryClick).toHaveBeenCalled();
  });
});
