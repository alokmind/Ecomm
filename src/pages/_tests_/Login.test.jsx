import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../redux/slices/userSlice';
import { MemoryRouter } from 'react-router-dom';

describe('Login', () => {
  function renderWithStore(userState = { name: '' }) {
    const store = configureStore({ reducer: { user: userReducer }, preloadedState: { user: userState } });
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
  }

  it('renders login form', () => {
    renderWithStore();
    expect(screen.getByText(/Login To E-commerce App/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('allows user to type in name field', () => {
    renderWithStore();
    const input = screen.getByPlaceholderText(/Enter your name/i);
    fireEvent.change(input, { target: { value: 'Alok' } });
    expect(input.value).toBe('Alok');
  });

  it('dispatches setUserName and navigates on login', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    const store = configureStore({ reducer: { user: userReducer }, preloadedState: { user: { name: '' } } });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    const input = screen.getByPlaceholderText(/Enter your name/i);
    fireEvent.change(input, { target: { value: 'Alok' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(store.getState().user.name).toBe('Alok');
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});