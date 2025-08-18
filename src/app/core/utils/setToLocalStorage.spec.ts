// setToLocalStorage.test.ts
import { setToLocalStorage } from './setToLocalStorage';

describe('setToLocalStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should store the given data as a JSON string in localStorage', () => {
    const mockData = { name: 'Juan', age: 30 };
    const key = 'user';

    setToLocalStorage(mockData, key);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(mockData)
    );
  });

  it('should overwrite existing value with the same key', () => {
    const key = 'user';
    localStorage.setItem(key, 'oldValue');

    const newData = { city: 'Madrid' };
    setToLocalStorage(newData, key);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(newData)
    );
    expect(localStorage.getItem(key)).toBe(JSON.stringify(newData));
  });
});
