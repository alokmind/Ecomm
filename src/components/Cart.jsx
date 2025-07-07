import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart, loadDiscounts } from '../redux/slices/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus, faTag, faPiggyBank, faGift } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    items, 
    totalQuantity, 
    originalMRPTotal,
    subtotal, 
    productSavings,
    cartDiscount, 
    totalAmount,
    totalSavings
  } = useSelector((state) => state.cart);

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

      .savings-badge {
        animation: bounce 2s infinite;
      }

      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
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

      {/* Total Savings Banner */}
      {totalSavings > 0 && (
        <div style={styles.totalSavingsBanner} className="savings-badge">
          <FontAwesomeIcon icon={faPiggyBank} style={styles.savingsIcon} />
          <span style={styles.savingsText}>
            🎉 Congratulations! You're saving ₹{totalSavings.toFixed(2)} on this order!
          </span>
        </div>
      )}

      {/* Cart Discount Information Banner */}
      {cartDiscount.percentage > 0 && (
        <div style={styles.discountBanner} className="discount-badge">
          <FontAwesomeIcon icon={faTag} style={styles.discountIcon} />
          <span style={styles.discountText}>
            🏷️ Cart Discount Applied: {cartDiscount.percentage}% off! 
            Saving ₹{cartDiscount.discountAmount.toFixed(2)}
          </span>
        </div>
      )}

      <div style={styles.cartItems}>
        {items.map((item) => {
          const itemProductSaving = (item.MRP - item.discountedPrice) * item.quantity;
          return (
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
                <div style={styles.priceContainer}>
                  <p style={styles.itemPrice}>₹{item.discountedPrice.toFixed(2)} each</p>
                  <p style={styles.itemMrp}>MRP: ₹{item.MRP}</p>
                  {itemProductSaving > 0 && (
                    <p style={styles.itemSaving}>
                      <FontAwesomeIcon icon={faGift} style={styles.smallSavingIcon} />
                      You save: ₹{itemProductSaving.toFixed(2)}
                    </p>
                  )}
                </div>
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
                <p style={styles.originalPrice}>₹{(item.MRP * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.cartSummary}>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Total Items:</span>
          <span style={styles.summaryValue}>{totalQuantity}</span>
        </div>
        
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Original MRP Total:</span>
          <span style={styles.summaryValue}>₹{originalMRPTotal.toFixed(2)}</span>
        </div>
        
        {productSavings > 0 && (
          <div style={styles.savingsRow}>
            <span style={styles.savingsLabel}>
              <FontAwesomeIcon icon={faGift} style={styles.smallSavingIcon} />
              Product Discounts:
            </span>
            <span style={styles.savingsValue}>-₹{productSavings.toFixed(2)}</span>
          </div>
        )}
        
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Subtotal:</span>
          <span style={styles.summaryValue}>₹{subtotal.toFixed(2)}</span>
        </div>
        
        {cartDiscount.percentage > 0 && (
          <div style={styles.discountRow}>
            <span style={styles.discountLabel}>
              <FontAwesomeIcon icon={faTag} style={styles.smallDiscountIcon} />
              Cart Discount ({cartDiscount.percentage}%):
            </span>
            <span style={styles.discountValue}>-₹{cartDiscount.discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        {/* Total Savings Summary */}
        {totalSavings > 0 && (
          <div style={styles.totalSavingsRow}>
            <span style={styles.totalSavingsLabel}>
              <FontAwesomeIcon icon={faPiggyBank} style={styles.totalSavingsIcon} />
              Total Savings:
            </span>
            <span style={styles.totalSavingsValue}>₹{totalSavings.toFixed(2)}</span>
          </div>
        )}
        
        <div style={styles.finalTotalRow}>
          <span style={styles.finalTotalLabel}>Final Amount:</span>
          <span style={styles.finalTotalValue}>₹{totalAmount.toFixed(2)}</span>
        </div>
        
        {/* Show next discount tier if applicable */}
        {cartDiscount.percentage === 0 && subtotal > 0 && (
          <div style={styles.nextDiscountInfo}>
            <p style={styles.nextDiscountText}>
              💡 Add ₹{(1000 - subtotal).toFixed(2)} more to get 5% cart discount!
            </p>
          </div>
        )}
        
        {cartDiscount.percentage > 0 && cartDiscount.percentage < 20 && (
          <div style={styles.nextDiscountInfo}>
            <p style={styles.nextDiscountText}>
              💡 Add more items to unlock higher cart discounts (up to 20% off)!
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
  totalSavingsBanner: {
    backgroundColor: '#fff3cd',
    border: '2px solid #ffc107',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(255, 193, 7, 0.3)',
  },
  savingsIcon: {
    color: '#856404',
    marginRight: '0.5rem',
    fontSize: '1.3rem',
  },
  savingsText: {
    color: '#856404',
    fontWeight: 'bold',
    fontSize: '1.2rem',
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
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  itemPrice: {
    margin: 0,
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
  itemSaving: {
    margin: 0,
    fontSize: '12px',
    color: '#28a745',
    fontWeight: 'bold',
  },
  smallSavingIcon: {
    marginRight: '0.25rem',
    color: '#28a745',
    fontSize: '10px',
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
  originalPrice: {
    margin: '0.25rem 0 0 0',
    fontSize: '12px',
    color: '#888',
    textDecoration: 'line-through',
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
  savingsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#d1ecf1',
    borderRadius: '4px',
    border: '1px solid #bee5eb',
  },
  savingsLabel: {
    fontSize: '16px',
    color: '#0c5460',
    fontWeight: 'bold',
  },
  savingsValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0c5460',
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
  totalSavingsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: '#fff3cd',
    borderRadius: '6px',
    border: '2px solid #ffc107',
    boxShadow: '0 2px 4px rgba(255, 193, 7, 0.2)',
  },
  totalSavingsLabel: {
    fontSize: '18px',
    color: '#856404',
    fontWeight: 'bold',
  },
  totalSavingsValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#856404',
  },
  totalSavingsIcon: {
    marginRight: '0.5rem',
    color: '#856404',
    fontSize: '1.1rem',
  },
  finalTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    border: '2px solid #6c757d',
  },
  finalTotalLabel: {
    fontSize: '20px',
    color: '#495057',
    fontWeight: 'bold',
  },
  finalTotalValue: {
    fontSize: '20px',
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
    transition: 'background-color 0.3s ease',
  },
};

export default Cart;