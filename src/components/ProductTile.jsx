function ProductTile({ product }) {
  const discountedPrice = product.MRP - (product.MRP * product.discountPercent) / 100;

  return (
    <div style={styles.tile}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <h3>{product.name}</h3>
      <p>MRP: ₹{product.MRP}</p>
      <p>Price: ₹{discountedPrice.toFixed(2)}</p>
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
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    marginBottom: '0.5rem',
  },
};

export default ProductTile;
