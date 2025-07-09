import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Cart from '../Cart';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { BrowserRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Cart', () => {
  beforeEach(() => {
    // Reset cart state before each test if needed
    store.dispatch({ type: 'cart/clearCart' });
    mockNavigate.mockReset();
  });

  it('renders cart header', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/Shopping Cart/i)).toBeInTheDocument();
  });

  it('shows empty cart message when cart is empty', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/Your Cart is Empty/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
  });

  it('navigates to home when Home button is clicked in empty cart', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Home/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('renders cart items and summary when cart has items', () => {
    // Add a product to cart
    store.dispatch({
      type: 'cart/addToCart',
      payload: {
        uniqueItemId: 'p1',
        name: 'Test Product',
        MRP: 100,
        discountedPrice: 80,
        discountPercent: 20,
        quantity: 2,
        image: 'test.jpg',
      },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByText(/Final Amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Cart/i })).toBeInTheDocument();
  });

  it('clears the cart when Clear Cart button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    // Add a product to cart
    store.dispatch({
      type: 'cart/addToCart',
      payload: {
        uniqueItemId: 'p2',
        name: 'Another Product',
        MRP: 200,
        discountedPrice: 150,
        discountPercent: 25,
        quantity: 1,
        image: 'test2.jpg',
      },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Clear Cart/i }));
    expect(window.confirm).toHaveBeenCalled();
    expect(screen.getByText(/Your Cart is Empty/i)).toBeInTheDocument();
  });

  it('calls handleCheckout and clears cart on checkout', async () => {
    // Add a product to cart
    store.dispatch({
      type: 'cart/addToCart',
      payload: {
        uniqueItemId: 'p3',
        name: 'Checkout Product',
        MRP: 300,
        discountedPrice: 250,
        discountPercent: 17,
        quantity: 1,
        image: 'test3.jpg',
      },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    );
    const checkoutBtn = screen.getByRole('button', { name: /Proceed to Checkout/i });
    fireEvent.click(checkoutBtn);
    // Wait for async checkout
    await waitFor(() => {
      expect(screen.getByText(/Your Cart is Empty/i)).toBeInTheDocument();
    });
  });

  it('navigates to home when Home button is clicked in cart header', () => {
    // Add a product to cart
    store.dispatch({
      type: 'cart/addToCart',
      payload: {
        uniqueItemId: 'p4',
        name: 'Header Home Product',
        MRP: 120,
        discountedPrice: 100,
        discountPercent: 17,
        quantity: 1,
        image: 'test4.jpg',
      },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getAllByRole('button', { name: /Home/i })[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});