import { render, screen, fireEvent } from '@testing-library/react';
import ProductsView from '../ProductsView';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../../redux/slices/productsSlice';
import cartReducer from '../../redux/slices/cartSlice';

jest.mock('../ProductTile', () => ({ product }) => <div data-testid="product-tile">{product.name}</div>);

describe('ProductsView', () => {
  const initialState = {
    products: {
      items: [
        { uniqueItemId: 'p1', name: 'Apple', MRP: 100, discountPercent: 10, rating: 4.5, uniqueCategoryID: 'fruits' },
        { uniqueItemId: 'p2', name: 'Banana', MRP: 50, discountPercent: 0, rating: 3.5, uniqueCategoryID: 'fruits' },
        { uniqueItemId: 'p3', name: 'Carrot', MRP: 30, discountPercent: 5, rating: 4.0, uniqueCategoryID: 'vegetables' },
      ],
      selectedCategoryID: 'all',
      searchTerm: '',
      status: 'idle',
    },
    cart: {
      discounts: [
        { minTotalCartValue: 100, discountPercentage: 10 },
        { minTotalCartValue: 200, discountPercentage: 20 },
      ],
    },
  };

  function renderWithStore(state = initialState) {
    const store = configureStore({ reducer: { products: productsReducer, cart: cartReducer }, preloadedState: state });
    return render(
      <Provider store={store}>
        <ProductsView />
      </Provider>
    );
  }

  it('renders discount banner if discounts are available', () => {
    renderWithStore();
    expect(screen.getByText(/% OFF/)).toBeInTheDocument();
    expect(screen.getByText(/On cart value above/)).toBeInTheDocument();
  });

  it('renders all products by default', () => {
    renderWithStore();
    expect(screen.getAllByTestId('product-tile').length).toBe(3);
  });

  it('filters products by category', () => {
    const state = {
      ...initialState,
      products: { ...initialState.products, selectedCategoryID: 'vegetables' },
    };
    renderWithStore(state);
    expect(screen.getAllByTestId('product-tile').length).toBe(1);
    expect(screen.getByText('Carrot')).toBeInTheDocument();
  });

  it('filters products by search term', () => {
    const state = {
      ...initialState,
      products: { ...initialState.products, searchTerm: 'ban' },
    };
    renderWithStore(state);
    expect(screen.getAllByTestId('product-tile').length).toBe(1);
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('filters products by price range', () => {
    renderWithStore();
    const minInput = screen.getAllByRole('spinbutton')[0];
    const maxInput = screen.getAllByRole('spinbutton')[1];
    fireEvent.change(minInput, { target: { value: 60 } });
    fireEvent.change(maxInput, { target: { value: 120 } });
    expect(screen.getAllByTestId('product-tile').length).toBe(1);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('sorts products by name ascending', () => {
    renderWithStore();
    const select = screen.getByLabelText(/Sort By/i);
    fireEvent.change(select, { target: { value: 'name-asc' } });
    const tiles = screen.getAllByTestId('product-tile');
    expect(tiles[0]).toHaveTextContent('Apple');
    expect(tiles[1]).toHaveTextContent('Banana');
    expect(tiles[2]).toHaveTextContent('Carrot');
  });

  it('sorts products by name descending', () => {
    renderWithStore();
    const select = screen.getByLabelText(/Sort By/i);
    fireEvent.change(select, { target: { value: 'name-desc' } });
    const tiles = screen.getAllByTestId('product-tile');
    expect(tiles[0]).toHaveTextContent('Carrot');
    expect(tiles[2]).toHaveTextContent('Apple');
  });

  it('shows loading and error states', () => {
    let state = { ...initialState, products: { ...initialState.products, status: 'loading' } };
    renderWithStore(state);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    state = { ...initialState, products: { ...initialState.products, status: 'failed' } };
    renderWithStore(state);
    expect(screen.getByText(/Failed to load data/i)).toBeInTheDocument();
  });
});