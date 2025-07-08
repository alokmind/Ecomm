import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProductTile from './ProductTile';
import React, { useState, useMemo, useEffect } from 'react';

// --- Main ProductsView ---
function ProductsView() {
  const { items, selectedCategoryID, searchTerm, status } = useSelector((state) => state.products);
  const discounts = useSelector((state) => state.cart.discounts);

  // --- Price Range State ---
  const prices = items.map((p) => p.MRP);
  const minProductPrice = 0;
  const maxProductPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const [minPrice, setMinPrice] = useState(minProductPrice);
  const [maxPrice, setMaxPrice] = useState(maxProductPrice);

  // Update min/max price when products are loaded
  useEffect(() => {
    if (prices.length > 0) {
      setMinPrice(minProductPrice);
      setMaxPrice(maxProductPrice);
    }
  }, [items]); // Only run when items change

  const [sortBy, setSortBy] = useState('name-asc'); // default sort

  // --- Filtering and Sorting ---
  const filteredProducts = useMemo(() => {
    let filtered = items.filter((product) => {
      const matchCategory =
        selectedCategoryID === 'all' || product.uniqueCategoryID === selectedCategoryID;
      const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice = product.MRP >= minPrice && product.MRP <= maxPrice;
      return matchCategory && matchSearch && matchPrice;
    });

    // Sorting
    if (sortBy === 'name-asc') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'rating-asc') {
      filtered = filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    } else if (sortBy === 'rating-desc') {
      filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return filtered;
  }, [items, selectedCategoryID, searchTerm, minPrice, maxPrice, sortBy]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Failed to load data.</p>;

  return (
    <div>
      {/* Discount Advertisement Banner */}
      {discounts && discounts.length > 0 && (
        <div style={styles.discountBannerTiles}>
          {[...discounts]
            .sort((a, b) => a.minTotalCartValue - b.minTotalCartValue)
            .map((d) => (
              <div key={d.minTotalCartValue} style={styles.discountTile}>
                <FontAwesomeIcon icon={['fas', 'tags']} style={styles.discountIcon} />
                <div>
                  <div style={styles.discountPercent}>
                    <b>{d.discountPercentage}% OFF</b>
                  </div>
                  <div style={styles.discountText}>
                    On cart value above <b>₹{d.minTotalCartValue}</b>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* --- Price Range Filter and Sorting Controls --- */}
      <div style={styles.filterSortBar}>
        <div style={styles.priceRangeContainer}>
          <label>
            Price Range:&nbsp;
            <input
              type="number"
              min={minProductPrice}
              max={maxPrice - 1}
              value={minPrice}
              onChange={(e) => {
                // Remove leading zeros and clamp value
                let value = e.target.value;
                // Remove all leading zeros except for "0"
                value = value.replace(/^0+(?=\d)/, '');
                // If empty, set to minProductPrice
                if (value === '') value = minProductPrice;
                value = Number(value);
                value = Math.max(minProductPrice, Math.min(value, maxPrice - 1));
                setMinPrice(value);
              }}
              style={styles.inputBox}
            />&nbsp;
            -
            <input
              type="number"
              min={minPrice + 1}
              max={maxProductPrice}
              value={maxPrice}
              onChange={(e) => {
                // Remove leading zeros and clamp value
                let value = e.target.value;
                value = value.replace(/^0+(?=\d)/, '');
                if (value === '') value = maxProductPrice;
                value = Number(value);
                value = Math.min(maxProductPrice, Math.max(value, minPrice + 1));
                setMaxPrice(value);
              }}
              style={styles.inputBox}
            />
          </label>
        </div>
        <div style={styles.sortContainer}>
          <label htmlFor="sortBy">Sort By: </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.inputBox}
          >
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
            <option value="rating-asc">Rating (Low → High)</option>
            <option value="rating-desc">Rating (High → Low)</option>
          </select>
        </div>
      </div>

      <div style={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <ProductTile key={product.uniqueItemId} product={product} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  discountBannerTiles: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  discountTile: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff8e1',
    border: '1px solid #ffe082',
    borderRadius: '8px',
    padding: '12px 18px',
    minWidth: '220px',
    boxShadow: '0 2px 8px rgba(255, 193, 7, 0.08)',
    // margin: '0.5rem 0',
    transition: 'box-shadow 0.2s',
  },
  discountIcon: {
    color: '#ff9800',
    fontSize: '2rem',
    marginRight: '12px',
  },
  discountPercent: {
    color: '#e65100',
    fontSize: '1.1rem',
    marginBottom: '2px',
    display: 'flex',
    alignItems: 'center',
  },
  discountText: {
    color: '#6d4c41',
    fontSize: '0.95rem',
  },
  filterSortBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  priceRangeContainer: {
    flex: 1,
    minWidth: 220,
  },
  sortContainer: {
    flex: 1,
    minWidth: 180,
    textAlign: 'right',
  },
  productsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  inputBox: {
    padding: 4,
    borderRadius: 4,
    border: '1px solid #ccc',
    width: 'auto',
    minWidth: 100,
    marginLeft: 8,
  },
};

export default ProductsView;