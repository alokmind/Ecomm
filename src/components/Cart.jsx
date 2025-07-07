import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart, loadDiscounts } from '../redux/slices/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus, faTag } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, subtotal, discount, totalAmount } = useSelector((state) => state.cart);

  // Load discounts when component mounts
  useEffect(() => {
    dispatch(loadDiscounts());
  }, [dispatch]);

  // Add CSS for hover effects when component mounts
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .cart-image-container {
        position: relative;
        margin-right: 1rem;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
      }
      
      .cart-item-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: block;
        pointer-events: auto;
      }
      
      .cart-image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 123, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: 4px;
        pointer-events: none;
      }
      
      .cart-image-container:hover .cart-item-image {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
      
      .cart-image-container:hover .cart-image-overlay {
        opacity: 1;
      }
      
      .cart-image-container:active .cart-item-image {
        transform: scale(0.98);
      }

      .discount-badge {
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    
    // Check if style already exists to avoid duplicates
    if (!document.querySelector('#cart-hover-styles')) {
      styleSheet.id = 'cart-hover-styles';
      document.head.appendChild(styleSheet);
    }
    
    // Cleanup function to remove styles when component unmounts
    return () => {
      const existingStyle = document.querySelector('#cart-hover-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      dispatch(clearCart());
    }
  };

  // Handle image click to navigate to product detail
  const handleImageClick = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Image clicked! Product ID:', productId);
    console.log('Navigating to:', `/home/product/${productId}`);
    
    try {
      navigate(`/home/product/${productId}`);
      console.log('Navigation successful');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to direct product route if nested route fails
      navigate(`/product/${productId}`);
    }
  };

  if (items.length === 0) {
    return (
      <div style={styles.emptyCart}>
        <h2>Your Cart is Empty</h2>
        <p>Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div style={styles.cartContainer}>
      <div style={styles.cartHeader}>
        <h2>Shopping Cart ({totalQuantity} items)</h2>
        <button onClick={handleClearCart} style={styles.clearButton}>
          Clear Cart
        </button>
      </div>

      {/* Discount Information Banner */}
      {discount.percentage > 0 && (
        <div style={styles.discountBanner} className="discount-badge">
          <FontAwesomeIcon icon={faTag} style={styles.discountIcon} />
          <span style={styles.discountText}>
            🎉 Great! You're saving {discount.percentage}% on your order! 
            Discount: ₹{discount.discountAmount.toFixed(2)}
          </span>
        </div>
      )}

      <div style={styles.cartItems}>
        {items.map((item) => (
          <div key={item.uniqueItemId} style={styles.cartItem}>
            <div 
              className="cart-image-container"
              onClick={(e) => handleImageClick(item.uniqueItemId, e)}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="cart-item-image"
                onError={(e) => {
                  console.log('Image load error:', e);
                  e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                }}
              />
              <div className="cart-image-overlay">
                <span style={styles.overlayText}>View Details</span>
              </div>
            </div>
            
            <div style={styles.itemDetails}>
              <h3 style={styles.itemName}>{item.name}</h3>
              <p style={styles.itemPrice}>₹{item.discountedPrice.toFixed(2)} each</p>
              <p style={styles.itemMrp}>MRP: ₹{item.MRP}</p>
            </div>

            <div style={styles.quantityControls}>
              <button
                onClick={() => handleRemoveFromCart(item.uniqueItemId)}
                style={styles.removeButton}
                title="Remove from cart"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button
                onClick={() => handleUpdateQuantity(item.uniqueItemId, item.quantity - 1)}
                style={styles.quantityButton}
                disabled={item.quantity <= 1}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span style={styles.quantity}>{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(item.uniqueItemId, item.quantity + 1)}
                style={styles.quantityButton}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>

            <div style={styles.itemTotal}>
              <p style={styles.totalPrice}>₹{(item.discountedPrice * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.cartSummary}>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Total Items:</span>
          <span style={styles.summaryValue}>{totalQuantity}</span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Subtotal:</span>
          <span style={styles.summaryValue}>₹{subtotal.toFixed(2)}</span>
        </div>
        
        {discount.percentage > 0 && (
          <div style={styles.discountRow}>
            <span style={styles.discountLabel}>
              <FontAwesomeIcon icon={faTag} style={styles.smallDiscountIcon} />
              Cart Discount ({discount.percentage}%):
            </span>
            <span style={styles.discountValue}>-₹{discount.discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Total Amount:</span>
          <span style={styles.summaryTotal}>₹{totalAmount.toFixed(2)}</span>
        </div>
        
        {/* Show next discount tier if applicable */}
        {discount.percentage === 0 && subtotal > 0 && (
          <div style={styles.nextDiscountInfo}>
            <p style={styles.nextDiscountText}>
              💡 Add ₹{(1000 - subtotal).toFixed(2)} more to get 5% discount!
            </p>
          </div>
        )}
        
        {discount.percentage > 0 && discount.percentage < 20 && (
          <div style={styles.nextDiscountInfo}>
            <p style={styles.nextDiscountText}>
              💡 Add more items to unlock higher discounts (up to 20% off)!
            </p>
          </div>
        )}
        
        <button style={styles.checkoutButton}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

const styles = {
  cartContainer: {
    padding: '1rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #eee',
    paddingBottom: '1rem',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  discountBanner: {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  discountIcon: {
    color: '#155724',
    marginRight: '0.5rem',
    fontSize: '1.2rem',
  },
  discountText: {
    color: '#155724',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
  },
  cartItems: {
    marginBottom: '2rem',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '1rem',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minWidth: '900px',
  },
  overlayText: {
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemDetails: {
    flex: 1,
    marginRight: '2rem',
  },
  itemName: {
    margin: '0 0 0.5rem 0',
    fontSize: '16px',
    fontWeight: '600',
  },
  itemPrice: {
    margin: '0 0 0.25rem 0',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#2c5530',
  },
  itemMrp: {
    margin: 0,
    fontSize: '12px',
    color: '#888',
    textDecoration: 'line-through',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '2rem',
    gap: '0.5rem',
  },
  quantityButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    width: '30px',
    height: '30px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    width: '30px',
    height: '30px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    margin: '0 0.5rem',
    fontSize: '16px',
    fontWeight: 'bold',
    minWidth: '30px',
    textAlign: 'center',
  },
  itemTotal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '120px',
  },
  totalPrice: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c5530',
  },
  cartSummary: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  summaryLabel: {
    fontSize: '16px',
    color: '#666',
  },
  summaryValue: {
    fontSize: '16px',
    fontWeight: '600',
  },
  discountRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#d4edda',
    borderRadius: '4px',
    border: '1px solid #c3e6cb',
  },
  discountLabel: {
    fontSize: '16px',
    color: '#155724',
    fontWeight: 'bold',
  },
  discountValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#155724',
  },
  smallDiscountIcon: {
    marginRight: '0.5rem',
    color: '#155724',
  },
  summaryTotal: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c5530',
  },
  nextDiscountInfo: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '4px',
    padding: '0.75rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  nextDiscountText: {
    margin: 0,
    fontSize: '14px',
    color: '#856404',
    fontWeight: '500',
  },
  checkoutButton: {
    width: '100%',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '1rem',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
  },
};

export default Cart;