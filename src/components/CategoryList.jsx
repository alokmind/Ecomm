import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategoryID, setSearchTerm } from '../redux/slices/productsSlice';

function CategoryList() {
  const categories = useSelector((state) => state.products.categories);
  const selectedCategoryID = useSelector((state) => state.products.selectedCategoryID);
  const dispatch = useDispatch();

  const handleCategoryClick = (categoryID) => {
    dispatch(setSelectedCategoryID(categoryID));
    dispatch(setSearchTerm('')); // ✅ Clear search filter!
  };

  return (
    <div style={styles.container}>
      {categories.map((category) => (
        <div
          key={category.uniqueCategoryID || 'all'}
          onClick={() => handleCategoryClick(category.uniqueCategoryID || 'all')}
          style={{
            ...styles.categoryItem,
            backgroundColor: selectedCategoryID === (category.uniqueCategoryID || 'all') ? '#ddd' : '#fff',
          }}
        >
          {category.categoryName}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    // width: '200px',
    // borderRight: '1px solid #ccc',
    padding: '1rem',
  },
  categoryItem: {
    padding: '0.5rem',
    marginBottom: '0.5rem',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default CategoryList;
