import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import { loadDiscounts } from './redux/slices/cartSlice';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import Login from './pages/Login';
import Home from './pages/Home';
import Cart from './components/Cart';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadDiscounts());
  }, [dispatch]);
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home/*" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
