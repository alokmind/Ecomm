import { render, screen, fireEvent } from '@testing-library/react';
import ProductTile from '../ProductTile';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { addToCart, updateQuantity } from '../../redux/slices/cartSlice';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ProductTile', () => {
  const product = {
    uniqueItemId: 'p1',
    name: 'Test Product',
    MRP: 100,
    discountPercent: 20,
    rating: 4.5,
    image: 'test.jpg',
  };

  function renderWithStore(cartState = { items: [] }) {
    const store = configureStore({ reducer: { cart: cartReducer }, preloadedState: { cart: cartState } });
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductTile product={product} />
        </BrowserRouter>
      </Provider>
    );
  }

  it('renders product name, price, and discount', () => {
    renderWithStore();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/Price: ₹80.00/)).toBeInTheDocument();
    expect(screen.getByText(/20% OFF/)).toBeInTheDocument();
  });

  it('shows Add to Cart button if not in cart', () => {
    renderWithStore();
    expect(screen.getByTitle('Add to Cart')).toBeInTheDocument();
  });

  it('dispatches addToCart when Add to Cart is clicked', () => {
    const store = configureStore({ reducer: { cart: cartReducer }, preloadedState: { cart: { items: [] } } });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductTile product={product} />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByTitle('Add to Cart'));
    expect(store.getState().cart.items.length).toBe(1);
    expect(store.getState().cart.items[0].uniqueItemId).toBe('p1');
  });

  it('shows quantity controls if product is in cart', () => {
    renderWithStore({ items: [{ uniqueItemId: 'p1', quantity: 2 }] });
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('dispatches updateQuantity when + or - is clicked', () => {
    const store = configureStore({ reducer: { cart: cartReducer }, preloadedState: { cart: { items: [{ uniqueItemId: 'p1', quantity: 2 }] } } });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductTile product={product} />
        </BrowserRouter>
      </Provider>
    );
    const plusBtn = screen.getByTitle('Increase quantity');
    fireEvent.click(plusBtn);
    expect(store.getState().cart.items[0].quantity).toBe(3);
    const minusBtn = screen.getByTitle('Decrease quantity');
    fireEvent.click(minusBtn);
    expect(store.getState().cart.items[0].quantity).toBe(2);
  });

  it('navigates to product detail on image click', () => {
    renderWithStore();
    fireEvent.click(screen.getByAltText('Test Product'));
    expect(mockNavigate).toHaveBeenCalledWith('/home/product/p1');
  });

  it('renders star rating', () => {
    renderWithStore();
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
  });
});
