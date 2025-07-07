import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);

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
  const handleImageClick = (productId) => {
    navigate(`/product/${productId}`);
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

      <div style={styles.cartItems}>
        {items.map((item) => (
          <div key={item.uniqueItemId} style={styles.cartItem}>
            <img 
              src={item.image} 
              alt={item.name} 
              style={styles.itemImage} 
              onClick={() => handleImageClick(item.uniqueItemId)}
            />
            
            <div style={styles.itemDetails}>
              <h3 style={styles.itemName}>{item.name}</h3>
              <p style={styles.itemPrice}>₹{item.discountedPrice.toFixed(2)} each</p>
              <p style={styles.itemMrp}>MRP: ₹{item.MRP}</p>
            </div>

            <div style={styles.quantityControls}>
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
              <button
                onClick={() => handleRemoveFromCart(item.uniqueItemId)}
                style={styles.removeButton}
                title="Remove from cart"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
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
          <span style={styles.summaryLabel}>Total Amount:</span>
          <span style={styles.summaryTotal}>₹{totalAmount.toFixed(2)}</span>
        </div>
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
    maxWidth: '800px',
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
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '1rem',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '1rem',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  itemDetails: {
    flex: 1,
    marginRight: '1rem',
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
    marginRight: '1rem',
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
    minWidth: '100px',
  },
  totalPrice: {
    margin: '0 0 0.5rem 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c5530',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
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
  summaryTotal: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c5530',
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