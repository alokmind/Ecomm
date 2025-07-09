import { render, screen } from '@testing-library/react';
import ProtectedLoginRoute from '../ProtectedLoginRoute';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../redux/slices/userSlice';
import { MemoryRouter } from 'react-router-dom';

describe('ProtectedLoginRoute', () => {
  function renderWithStore(userState) {
    const store = configureStore({ reducer: { user: userReducer }, preloadedState: { user: userState } });
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedLoginRoute>
            <div>Login Page</div>
          </ProtectedLoginRoute>
        </MemoryRouter>
      </Provider>
    );
  }

  it('renders children if not logged in', () => {
    renderWithStore({ name: '' });
    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  it('redirects to /home if logged in', () => {
    renderWithStore({ name: 'Alok' });
    // The Navigate component does not render children, so Login Page should not be present
    expect(screen.queryByText(/Login Page/i)).not.toBeInTheDocument();
  });
});
