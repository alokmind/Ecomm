import productsReducer, { setSelectedCategoryID, setSearchTerm, resetProducts } from '../productsSlice';

describe('productsSlice', () => {
  const initialState = {
    items: [],
    categories: [],
    selectedCategoryID: 'all',
    searchTerm: '',
    status: 'idle',
  };

  it('should return the initial state', () => {
    expect(productsReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle setSelectedCategoryID', () => {
    const state = productsReducer(initialState, setSelectedCategoryID('cat1'));
    expect(state.selectedCategoryID).toBe('cat1');
  });

  it('should handle setSearchTerm', () => {
    const state = productsReducer(initialState, setSearchTerm('apple'));
    expect(state.searchTerm).toBe('apple');
  });

  it('should handle resetProducts', () => {
    const state = productsReducer({ ...initialState, selectedCategoryID: 'cat2', searchTerm: 'banana' }, resetProducts());
    expect(state.selectedCategoryID).toBe('all');
    expect(state.searchTerm).toBe('');
  });
});
