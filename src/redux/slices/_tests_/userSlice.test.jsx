import userReducer, { setUserName, logout } from '../userSlice';

describe('userSlice', () => {
  it('should return the initial state', () => {
    expect(userReducer(undefined, {})).toEqual({ name: '' });
  });

  it('should handle setUserName', () => {
    const state = userReducer({ name: '' }, setUserName('Alok'));
    expect(state.name).toBe('Alok');
  });

  it('should handle logout', () => {
    const state = userReducer({ name: 'Alok' }, logout());
    expect(state.name).toBe('');
  });
});