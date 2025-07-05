import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchProductsAndCategories, setSearchTerm, setSelectedCategoryID } from '../redux/slices/productsSlice';

import CategoryList from '../components/CategoryList';
import ProductTile from '../components/ProductTile';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector((state) => state.user.name);
  const { items, categories, selectedCategoryID, searchTerm, status } = useSelector((state) => state.products);

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

  const filteredProducts = items.filter((product) => {
    const matchCategory =
      selectedCategoryID === 'all' || product.uniqueCategoryID === selectedCategoryID;

    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <CategoryList />
      </div>
      <div style={styles.main}>
        <div style={styles.topBar}>

            <div>
                <b>Welcome, {name}!</b>
            </div>
            <div>
            <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            style={styles.searchInput}
          />
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>
        </div>

        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>Failed to load data.</p>}

        <div style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <ProductTile key={product.uniqueItemId} product={product} />
          ))}
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
  logoutButton: {
    padding: '0.5rem 1rem',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  searchInput: {
    padding: '0.5rem',
    width: '200px',
  },
  productsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
};

export default Home;
