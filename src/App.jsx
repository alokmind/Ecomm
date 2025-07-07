import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './pages/Login';
import Home from './pages/Home';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home/*" element={<Home />} />
           <Route path="/cart" element={<Cart />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
