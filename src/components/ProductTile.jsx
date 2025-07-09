import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faPlus, faMinus, faStar } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart, updateQuantity } from '../redux/slices/cartSlice';
import './ProductTile.css';

function ProductTile({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const discountedPrice = product.MRP - (product.MRP * product.discountPercent) / 100;

  // Check if product is in cart and get its quantity
  const cartItem = cartItems.find(item => item.uniqueItemId === product.uniqueItemId);
  const isInCart = !!cartItem;
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleIncreaseQuantity = () => {
    dispatch(updateQuantity({ productId: product.uniqueItemId, quantity: quantity + 1 }));
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ productId: product.uniqueItemId, quantity: quantity - 1 }));
    } else {
      dispatch(updateQuantity({ productId: product.uniqueItemId, quantity: 0 }));
    }
  };

  // Handle image click to navigate to product detail
  const handleImageClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Product tile image clicked! Product ID:', product.uniqueItemId);
    console.log('Navigating to:', `/home/product/${product.uniqueItemId}`);
    
    try {
      navigate(`/home/product/${product.uniqueItemId}`);
      console.log('Navigation successful');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to direct product route if nested route fails
      navigate(`/product/${product.uniqueItemId}`);
    }
  };

  // Function to render star rating
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div style={styles.starRating}>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, index) => (
          <FontAwesomeIcon key={`full-${index}`} icon={faStar} style={styles.starFull} />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <FontAwesomeIcon icon={faStar} style={styles.starHalf} />
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <FontAwesomeIcon key={`empty-${index}`} icon={faStar} style={styles.starEmpty} />
        ))}
        
        <span style={styles.ratingText}>({product.rating})</span>
      </div>
    );
  };

  return (
    <div style={styles.tile} className="product-tile">
      <div 
        className="product-image-container"
        onClick={handleImageClick}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-tile-image"
          onError={(e) => {
            console.log('Image load error:', e);
            e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
          }}
        />
        <div className="product-image-overlay">
          <span style={styles.overlayText}>View Details</span>
        </div>
      </div>
      <h3 style={styles.productName}>{product.name}</h3>
      
      <div style={styles.priceCartContainer}>
        <div style={styles.priceSection}>
          {product.discountPercent > 0 && (
            <>
              <p style={styles.mrp}>MRP: ₹{product.MRP}</p>
              <p style={styles.discountPercent}>{product.discountPercent}% OFF</p>
            </>
          )}
          <p style={styles.discountedPrice}>Price: ₹{discountedPrice.toFixed(2)}</p>
        </div>
        
        {!isInCart ? (
          <button 
            style={styles.cartButton}
            onClick={handleAddToCart}
            title="Add to Cart"
          >
            <FontAwesomeIcon icon={faShoppingCart} style={styles.cartIcon} />
          </button>
        ) : (
          <div style={styles.quantityControls}>
            <button 
              style={styles.minusButton}
              onClick={handleDecreaseQuantity}
              title="Decrease quantity"
            >
              <FontAwesomeIcon icon={faMinus} style={styles.quantityIcon} />
            </button>
            <span style={styles.quantityDisplay}>{quantity}</span>
            <button 
              style={styles.plusButton}
              onClick={handleIncreaseQuantity}
              title="Increase quantity"
            >
              <FontAwesomeIcon icon={faPlus} style={styles.quantityIcon} />
            </button>
          </div>
        )}
      </div>
      
      {/* Rating section at the bottom */}
      <div style={styles.ratingContainer}>
        {renderStarRating(product.rating)}
      </div>
    </div>
  );
}

const styles = {
  tile: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    flex: '1 1 220px', // grow, shrink, basis
    maxWidth: '250px',
    minWidth: '220px',
    margin: '0',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    background: '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  overlayText: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
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
    height: '4rem'
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
    margin: '0 0 0.25rem 0',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#2c5530',
  },
  discountPercent: {
    margin: 0,
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#dc3545',
    backgroundColor: '#ffe6e6',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid #ffcccc',
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
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '20px',
    padding: '4px',
    border: '1px solid #dee2e6',
  },
  minusButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
    fontSize: '12px',
  },
  plusButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
    fontSize: '12px',
  },
  quantityIcon: {
    fontSize: '10px',
  },
  quantityDisplay: {
    minWidth: '20px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    marginTop: '0.75rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid #eee',
  },
  starRating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
  },
  starFull: {
    color: '#ffc107',
    fontSize: '14px',
  },
  starHalf: {
    color: '#ffc107',
    fontSize: '14px',
    opacity: 0.5,
  },
  starEmpty: {
    color: '#e9ecef',
    fontSize: '14px',
  },
  ratingText: {
    marginLeft: '6px',
    fontSize: '12px',
    color: '#666',
    fontWeight: '500',
  },
};

export default ProductTile;
