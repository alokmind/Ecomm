import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchProductsAndCategories, setSearchTerm, setSelectedCategoryID, resetProducts } from '../redux/slices/productsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import CategoryList from '../components/CategoryList';
import ProductsView from '../components/ProductsView';
import CartView from '../components/CartView';
import ProductDetail from '../components/ProductDetail';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const name = useSelector((state) => state.user.name);
  const { items, searchTerm } = useSelector((state) => state.products);
  const { totalQuantity } = useSelector((state) => state.cart);

  // Check if current route is cart or product detail
  const isCartRoute = location.pathname.includes('/home/cart');
  const isProductDetailRoute = location.pathname.includes('/home/product/');

  useEffect(() => {
    dispatch(fetchProductsAndCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!name) {
      navigate('/');
    }
  }, [name, navigate]);

  const handleLogout = () => {
    // Clear cart from Redux state and localStorage
    dispatch(clearCart());
    // Clear user data
    dispatch(logout());
    dispatch(resetProducts());
    // Navigate to login page
    navigate('/');
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    dispatch(setSearchTerm(searchValue));

    if (searchValue.trim() !== '') {
      // Find first matching product
      const match = items.find((product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      if (match) {
        dispatch(setSelectedCategoryID(match.uniqueCategoryID));
      } else {
        // If no match, show all
        dispatch(setSelectedCategoryID('all'));
      }
    } else {
      // If search cleared, reset to all
      dispatch(setSelectedCategoryID('all'));
    }
  };

  const handleCartClick = () => {
    navigate('/home/cart');
  };

  const handleCategoryClick = () => {
    navigate('/home/products');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar: only show if not on cart or product detail */}
      {!(isCartRoute || isProductDetailRoute) && (
        <div style={styles.sidebar}>
          <div onClick={handleCategoryClick}>
            <CategoryList />
          </div>
        </div>
      )}
      {/* Main area: adjust width if sidebar is hidden */}
      <div
        style={{
          ...styles.main,
          width: (isCartRoute || isProductDetailRoute) ? '100%' : undefined
        }}
      >
        <div style={styles.topBar}>
          <div>
            <b>Welcome, {name}!</b>
          </div>
          <div style={styles.rightSection}>
            {!isCartRoute && !isProductDetailRoute && (
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                style={styles.searchInput}
              />
            )}
            <div style={styles.cartIconContainer} onClick={handleCartClick}>
              <FontAwesomeIcon icon={faShoppingCart} style={styles.cartIcon} />
              {totalQuantity > 0 && (
                <span style={styles.cartBadge}>{totalQuantity}</span>
              )}
            </div>
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </div>
        </div>
        <div style={styles.routes}>
          <Routes>
            <Route path="/" element={<Navigate to="/home/products" replace />} />
            <Route path="/products" element={<ProductsView />} />
            <Route path="/cart" element={<CartView />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  sidebar: {
    width: '190px',
    borderRight: '1px solid #ccc',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '.5rem',
    paddingRight: '0',
    paddingLeft: '1rem',
  },
  routes: {
    height: 'calc(100vh - 78px)',
    overflowY: 'auto',
    paddingRight: '1rem',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '1rem',
    paddingRight: '1rem',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  searchInput: {
    padding: '0.5rem',
    width: '200px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  cartIconContainer: {
    position: 'relative',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
  },
  cartIcon: {
    fontSize: '20px',
    color: '#007bff',
  },
  cartBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
};

export default Home;
