import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';
import '@testing-library/jest-dom';

jest.mock('@core/utils/constants', () => ({
  BASE_API: 'BASE_API',
  LAST_SEARCH_QUERY_KEY: 'LAST_SEARCH_QUERY_KEY',
  PHOTOS_KEY: 'PHOTOS_KEY',
  FAV_PHOTOS_KEY: 'FAV_PHOTOS_KEY',
}));

const mockMediaQuery = {
  matches: false,
  media: '',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockReturnValue(mockMediaQuery),
});

beforeAll(() => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  jest.spyOn(localStorage, 'setItem');
  jest.spyOn(localStorage, 'getItem');
});

setupZonelessTestEnv();
