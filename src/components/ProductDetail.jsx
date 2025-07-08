import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, updateQuantity } from '../redux/slices/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faShoppingCart, 
  faPlus, 
  faMinus, 
  faStar,
  faStarHalfAlt
} from '@fortawesome/free-solid-svg-icons';

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const products = useSelector((state) => state.products.items);
  const cartItems = useSelector((state) => state.cart.items);
  
  // Find the product by uniqueItemId
  const product = products.find(p => p.uniqueItemId === productId);
  
  // Check if product is in cart and get its quantity
  const cartItem = cartItems.find(item => item.uniqueItemId === productId);
  const isInCart = !!cartItem;
  const quantity = cartItem ? cartItem.quantity : 0;
  
  if (!product) {
    return (
      <div style={styles.container}>
        <div style={styles.notFound}>
          <h2>Product Not Found</h2>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} /> Go Back
          </button>
        </div>
      </div>
    );
  }
  
  const discountedPrice = product.MRP - (product.MRP * product.discountPercent) / 100;
  const savings = product.MRP - discountedPrice;
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
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
  
  // Function to render star rating
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div style={styles.starRating}>
        {[...Array(fullStars)].map((_, index) => (
          <FontAwesomeIcon key={`full-${index}`} icon={faStar} style={styles.starFull} />
        ))}
        {hasHalfStar && (
          <FontAwesomeIcon icon={faStarHalfAlt} style={styles.starFull} />
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <FontAwesomeIcon key={`empty-${index}`} icon={faStar} style={styles.starEmpty} />
        ))}
        <span style={styles.ratingText}>({rating})</span>
      </div>
    );
  };
  
  // Static reviews data
  const staticReviews = [
    {
      id: 1,
      userName: "Priya Sharma",
      rating: 5,
      comment: "Excellent quality product! Highly recommended.",
      date: "2024-01-15"
    },
    {
      id: 2,
      userName: "Rahul Kumar",
      rating: 4,
      comment: "Good value for money. Fast delivery.",
      date: "2024-01-10"
    },
    {
      id: 3,
      userName: "Anjali Patel",
      rating: 5,
      comment: "Amazing product! Exceeded my expectations.",
      date: "2024-01-08"
    },
    {
      id: 4,
      userName: "Vikram Singh",
      rating: 4,
      comment: "Quality is good, packaging could be better.",
      date: "2024-01-05"
    }
  ];
  
  return (
    <div style={styles.container}>
      {/* Header with back button */}
      <div style={styles.header}>
        <button onClick={handleGoBack} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
      </div>
      
      {/* Product Details */}
      <div style={styles.productContainer}>
        <div style={styles.imageSection}>
          <img src={product.image} alt={product.name} style={styles.productImage} />
        </div>
        
        <div style={styles.detailsSection}>
          <h1 style={styles.productName}>{product.name}</h1>
          
          {/* Rating */}
          <div style={styles.ratingContainer}>
            {renderStarRating(product.rating)}
            <span style={styles.reviewCount}>({staticReviews.length} reviews)</span>
          </div>
          
          {/* Price Section */}
          <div style={styles.priceSection}>
            <div style={styles.priceRow}>
              <span style={styles.currentPrice}>₹{discountedPrice.toFixed(2)}</span>
              <span style={styles.originalPrice}>₹{product.MRP}</span>
              {product.discountPercent > 0 && (
                <span style={styles.discountBadge}>{product.discountPercent}% OFF</span>
              )}
            </div>
            {savings > 0 && (
              <p style={styles.savings}>You save ₹{savings.toFixed(2)}</p>
            )}
          </div>
          
          {/* Description */}
          <div style={styles.descriptionSection}>
            <h3>Product Description</h3>
            <p style={styles.description}>
              {product.description || `Experience the premium quality of ${product.name}. This carefully crafted product offers exceptional value and performance. Perfect for daily use with long-lasting durability and excellent features that make it stand out from the competition.`}
            </p>
          </div>
          
          {/* Add to Cart Section */}
          <div style={styles.cartSection}>
            {!isInCart ? (
              <button onClick={handleAddToCart} style={styles.addToCartButton}>
                <FontAwesomeIcon icon={faShoppingCart} style={styles.cartIcon} />
                Add to Cart
              </button>
            ) : (
              <div style={styles.quantitySection}>
                <span style={styles.quantityLabel}>Quantity:</span>
                <div style={styles.quantityControls}>
                  <button onClick={handleDecreaseQuantity} style={styles.quantityButton}>
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span style={styles.quantityDisplay}>{quantity}</span>
                  <button onClick={handleIncreaseQuantity} style={styles.quantityButton}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div style={styles.reviewsSection}>
        <h3 style={styles.reviewsTitle}>Customer Reviews</h3>
        <div style={styles.reviewsList}>
          {staticReviews.map((review) => (
            <div key={review.id} style={styles.reviewItem}>
              <div style={styles.reviewHeader}>
                <span style={styles.reviewerName}>{review.userName}</span>
                <div style={styles.reviewRating}>
                  {renderStarRating(review.rating)}
                </div>
                <span style={styles.reviewDate}>{review.date}</span>
              </div>
              <p style={styles.reviewComment}>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem',
    backgroundColor: '#fff',
    paddingTop: '0',
  },
  header: {
    marginBottom: '2rem',
  },
  backButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s ease',
  },
  notFound: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
  },
  productContainer: {
    display: 'flex',
    gap: '3rem',
    marginBottom: '3rem',
    flexWrap: 'wrap',
  },
  imageSection: {
    flex: '1',
    minWidth: '300px',
  },
  productImage: {
    width: '100%',
    maxWidth: '500px',
    height: 'auto',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  detailsSection: {
    flex: '1',
    minWidth: '300px',
  },
  productName: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1rem',
    lineHeight: '1.2',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  starRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  starFull: {
    color: '#ffc107',
    fontSize: '18px',
  },
  starEmpty: {
    color: '#e9ecef',
    fontSize: '18px',
  },
  ratingText: {
    marginLeft: '6px',
    fontSize: '16px',
    color: '#666',
    fontWeight: '500',
  },
  reviewCount: {
    fontSize: '14px',
    color: '#666',
  },
  priceSection: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  currentPrice: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2c5530',
  },
  originalPrice: {
    fontSize: '1.2rem',
    color: '#888',
    textDecoration: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  savings: {
    color: '#28a745',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
  },
  descriptionSection: {
    marginBottom: '2rem',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
    marginTop: '0.5rem',
  },
  cartSection: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s ease',
  },
  cartIcon: {
    fontSize: '18px',
  },
  quantitySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  quantityLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'white',
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
  },
  quantityButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  quantityDisplay: {
    minWidth: '40px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  reviewsSection: {
    marginTop: '3rem',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },
  reviewsTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1.5rem',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  reviewItem: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.75rem',
    flexWrap: 'wrap',
  },
  reviewerName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  reviewRating: {
    display: 'flex',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: '14px',
    color: '#666',
    marginLeft: 'auto',
  },
  reviewComment: {
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#555',
    margin: 0,
  },
};

export default ProductDetail;