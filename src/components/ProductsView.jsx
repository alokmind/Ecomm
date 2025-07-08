import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProductTile from './ProductTile';

function ProductsView() {
  const { items, selectedCategoryID, searchTerm, status } = useSelector((state) => state.products);
  const discounts = useSelector((state) => state.cart.discounts);

  const filteredProducts = items.filter((product) => {
    const matchCategory =
      selectedCategoryID === 'all' || product.uniqueCategoryID === selectedCategoryID;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Failed to load data.</p>;

  return (
    <div>
      {/* Discount Advertisement Banner */}
      {discounts && discounts.length > 0 && (
        <div style={styles.discountBannerTiles}>
          {discounts
            .slice()
            .sort((a, b) => a.minTotalCartValue - b.minTotalCartValue)
            .map((d) => (
              <div key={d.minTotalCartValue} style={styles.discountTile}>
                <FontAwesomeIcon icon={['fas', 'tags']} style={styles.discountIcon} />
                <div>
                  <div style={styles.discountPercent}>
                    <FontAwesomeIcon icon={['fas', 'percent']} style={{ marginRight: 4 }} />
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
    marginBottom: '1.5rem',
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
    margin: '0.5rem 0',
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
  productsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
};

export default ProductsView;