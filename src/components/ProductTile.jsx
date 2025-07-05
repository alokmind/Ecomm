import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function ProductTile({ product }) {
  const discountedPrice = product.MRP - (product.MRP * product.discountPercent) / 100;

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Added to cart:', product);
  };

  return (
    <div style={styles.tile}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <h3 style={styles.productName}>{product.name}</h3>
      
      <div style={styles.priceCartContainer}>
        <div style={styles.priceSection}>
          <p style={styles.mrp}>MRP: ₹{product.MRP}</p>
          <p style={styles.discountedPrice}>Price: ₹{discountedPrice.toFixed(2)}</p>
        </div>
        
        <button 
          style={styles.cartButton}
          onClick={handleAddToCart}
          title="Add to Cart"
        >
          <FontAwesomeIcon icon={faShoppingCart} style={styles.cartIcon} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  tile: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    width: '200px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    marginBottom: '0.5rem',
    borderRadius: '4px',
  },
  productName: {
    margin: '0.5rem 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  priceCartContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1rem',
    padding: '0.5rem 0',
  },
  priceSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  mrp: {
    margin: '0 0 0.25rem 0',
    fontSize: '12px',
    color: '#888',
    textDecoration: 'line-through',
  },
  discountedPrice: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#2c5530',
  },
  cartButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  cartIcon: {
    color: 'white',
    fontSize: '16px',
  },
};

export default ProductTile;
