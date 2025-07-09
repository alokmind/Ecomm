import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import { loadDiscounts } from './redux/slices/cartSlice';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedLoginRoute from './components/ProtectedLoginRoute';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadDiscounts());
  }, [dispatch]);
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedLoginRoute>
                <Login />
              </ProtectedLoginRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedLoginRoute>
                <Login />
              </ProtectedLoginRoute>
            }
          />
          <Route path="/home/*" element={<Home />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
