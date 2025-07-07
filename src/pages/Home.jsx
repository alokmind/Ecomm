import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProductsAndCategories, setSearchTerm, setSelectedCategoryID } from '../redux/slices/productsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import CategoryList from '../components/CategoryList';
import ProductTile from '../components/ProductTile';
import Cart from '../components/Cart';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  
  const name = useSelector((state) => state.user.name);
  const { items, categories, selectedCategoryID, searchTerm, status } = useSelector((state) => state.products);
  const { totalQuantity } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchProductsAndCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!name) {
      navigate('/');
    }
  }, [name, navigate]);

  const handleLogout = () => {
    dispatch(logout());
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
    setShowCart(true);
  };

  const handleCategoryClick = () => {
    setShowCart(false);
  };

  const filteredProducts = items.filter((product) => {
    const matchCategory =
      selectedCategoryID === 'all' || product.uniqueCategoryID === selectedCategoryID;

    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div onClick={handleCategoryClick}>
          <CategoryList />
        </div>
      </div>
      <div style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <b>Welcome, {name}!</b>
          </div>
          <div style={styles.rightSection}>
            {!showCart && (
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

        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>Failed to load data.</p>}

        {showCart ? (
          <Cart />
        ) : (
          <div style={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <ProductTile key={product.uniqueItemId} product={product} />
            ))}
          </div>
        )}
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
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '1rem',
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
  productsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
};

export default Home;
