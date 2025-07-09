import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../Home';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../redux/slices/userSlice';
import productsReducer from '../../redux/slices/productsSlice';
import cartReducer from '../../redux/slices/cartSlice';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/CategoryList', () => () => <div data-testid="category-list">CategoryList</div>);
jest.mock('../../components/ProductsView', () => () => <div data-testid="products-view">ProductsView</div>);
jest.mock('../../components/CartView', () => () => <div data-testid="cart-view">CartView</div>);
jest.mock('../../components/ProductDetail', () => () => <div data-testid="product-detail">ProductDetail</div>);

describe('Home', () => {
  function renderWithStore({ user, products, cart }, initialEntries = ['/home/products']) {
    const store = configureStore({ reducer: { user: userReducer, products: productsReducer, cart: cartReducer }, preloadedState: { user, products, cart } });
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <Home />
        </MemoryRouter>
      </Provider>
    );
  }

  const user = { name: 'Alok' };
  const products = { items: [], searchTerm: '', selectedCategoryID: 'all', categories: [] };
  const cart = { totalQuantity: 0 };

  it('renders sidebar and products view on /home/products', () => {
    renderWithStore({ user, products, cart }, ['/home/products']);
    expect(screen.getByTestId('category-list')).toBeInTheDocument();
    expect(screen.getByTestId('products-view')).toBeInTheDocument();
  });

  it('renders cart view and hides sidebar on /home/cart', () => {
    renderWithStore({ user, products, cart }, ['/home/cart']);
    expect(screen.queryByTestId('category-list')).not.toBeInTheDocument();
    expect(screen.getByTestId('cart-view')).toBeInTheDocument();
  });

  it('renders product detail and hides sidebar on /home/product/:id', () => {
    renderWithStore({ user, products, cart }, ['/home/product/123']);
    expect(screen.queryByTestId('category-list')).not.toBeInTheDocument();
    expect(screen.getByTestId('product-detail')).toBeInTheDocument();
  });

  it('shows welcome message with user name', () => {
    renderWithStore({ user, products, cart });
    expect(screen.getByText(/Welcome, Alok/i)).toBeInTheDocument();
  });

  it('shows logout button and triggers logout', () => {
    renderWithStore({ user, products, cart });
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  it('shows cart icon and badge if totalQuantity > 0', () => {
    renderWithStore({ user, products, cart: { totalQuantity: 5 } });
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
