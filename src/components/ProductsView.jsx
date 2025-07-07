import { useSelector } from 'react-redux';
import ProductTile from './ProductTile';

function ProductsView() {
  const { items, selectedCategoryID, searchTerm, status } = useSelector((state) => state.products);

  const filteredProducts = items.filter((product) => {
    const matchCategory =
      selectedCategoryID === 'all' || product.uniqueCategoryID === selectedCategoryID;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Failed to load data.</p>;

  return (
    <div style={styles.productsGrid}>
      {filteredProducts.map((product) => (
        <ProductTile key={product.uniqueItemId} product={product} />
      ))}
    </div>
  );
}

const styles = {
  productsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
};

export default ProductsView;