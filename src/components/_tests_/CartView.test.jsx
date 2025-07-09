import { render, screen } from '@testing-library/react';
import CartView from '../CartView';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { BrowserRouter } from 'react-router-dom';

jest.mock('./Cart', () => () => <div data-testid="mock-cart">Mock Cart</div>);

describe('CartView', () => {
  it('renders Cart component', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CartView />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByTestId('mock-cart')).toBeInTheDocument();
  });
});
