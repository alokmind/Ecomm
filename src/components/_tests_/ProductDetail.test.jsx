import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetail from '../ProductDetail';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import productsReducer from '../../redux/slices/productsSlice';
import cartReducer from '../../redux/slices/cartSlice';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ productId: 'p1' }),
}));

describe('ProductDetail', () => {
  const initialState = {
    products: {
      items: [
        {
          uniqueItemId: 'p1',
          name: 'Test Product',
          MRP: 100,
          discountPercent: 20,
          rating: 4.5,
          image: 'test.jpg',
          description: 'A test product',
        },
      ],
    },
    cart: {
      items: [],
    },
  };

  function renderWithStore(state = initialState) {
    const store = configureStore({ reducer: { products: productsReducer, cart: cartReducer }, preloadedState: state });
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/home/product/p1`]}>
          <Routes>
            <Route path="/home/product/:productId" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  }

  it('renders product details', () => {
    renderWithStore();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/A test product/)).toBeInTheDocument();
    expect(screen.getByText(/You save/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument();
  });

  it('shows not found if product does not exist', () => {
    const state = { ...initialState, products: { items: [] } };
    renderWithStore(state);
    expect(screen.getByText(/Product Not Found/i)).toBeInTheDocument();
  });

  it('calls navigate(-1) when Back button is clicked', () => {
    renderWithStore();
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('calls navigate("/home") when Home button is clicked', () => {
    renderWithStore();
    fireEvent.click(screen.getByRole('button', { name: /Home/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('dispatches addToCart when Add to Cart is clicked', () => {
    const store = configureStore({ reducer: { products: productsReducer, cart: cartReducer }, preloadedState: initialState });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/home/product/p1`]}>
          <Routes>
            <Route path="/home/product/:productId" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Add to Cart/i }));
    expect(store.getState().cart.items.length).toBe(1);
    expect(store.getState().cart.items[0].uniqueItemId).toBe('p1');
  });

  it('shows quantity controls if product is in cart', () => {
    const state = {
      ...initialState,
      cart: {
        items: [{ uniqueItemId: 'p1', quantity: 2 }],
      },
    };
    renderWithStore(state);
    expect(screen.getByText(/Quantity:/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('dispatches updateQuantity when + or - is clicked', () => {
    const state = {
      ...initialState,
      cart: {
        items: [{ uniqueItemId: 'p1', quantity: 2 }],
      },
    };
    const store = configureStore({ reducer: { products: productsReducer, cart: cartReducer }, preloadedState: state });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/home/product/p1`]}>
          <Routes>
            <Route path="/home/product/:productId" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    const plusBtn = screen.getByRole('button', { name: '' }); // The + button has no accessible name
    fireEvent.click(plusBtn);
    expect(store.getState().cart.items[0].quantity).toBe(3);
  });
});
