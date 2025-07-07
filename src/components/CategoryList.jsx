import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategoryID } from '../redux/slices/productsSlice';

function CategoryList({ onCategoryClick }) {
  const dispatch = useDispatch();
  const { categories, selectedCategoryID } = useSelector((state) => state.products);

  const handleCategoryClick = (categoryId) => {
    dispatch(setSelectedCategoryID(categoryId));
    if (onCategoryClick) {
      onCategoryClick();
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Categories</h3>
      <ul style={styles.list}>
        <li
          style={{
            ...styles.listItem,
            ...(selectedCategoryID === 'all' ? styles.activeItem : {}),
          }}
          onClick={() => handleCategoryClick('all')}
        >
          All
        </li>
        {categories.slice(1).map((category) => (
          <li
            key={category.uniqueCategoryID}
            style={{
              ...styles.listItem,
              ...(selectedCategoryID === category.uniqueCategoryID ? styles.activeItem : {}),
            }}
            onClick={() => handleCategoryClick(category.uniqueCategoryID)}
          >
            {category.categoryName}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: '1rem',
  },
  title: {
    margin: '0 0 1rem 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    borderRadius: '4px',
    marginBottom: '0.25rem',
    transition: 'background-color 0.2s ease',
    color: '#666',
  },
  activeItem: {
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: '600',
  },
};

export default CategoryList;
