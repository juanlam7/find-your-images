import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { SearchField } from './searcher';
import { ImagesService } from '@core/services/images.service';
import { I18N_TOKEN } from '@core/tokens/i18n.token';
import { LAST_SEARCH_QUERY_KEY } from '@core/utils/constants';
import { loadFromLocalStorage } from '@core/utils/loadFromLocalStorage';
import { LastQuery } from '@core/types';
import { TranslationService } from '@core/services/translation.services';

jest.mock('@core/utils/loadFromLocalStorage');

jest.mock('@core/services/translation.services', () => ({
  TranslationService: jest.fn().mockImplementation(() => ({
    switchLanguage: jest.fn(),
    getTranslation: jest.fn().mockImplementation((key) => key),
    i18n: jest.fn().mockReturnValue({}),
  })),
}));

const mockLanguageService = {
  switchLanguage: jest.fn(),
  getTranslation: jest.fn().mockImplementation((key) => key),
  i18n: jest.fn().mockReturnValue({}),
};

describe('SearchField Component', () => {
  const mockImagesService = {
    historyKeyQuery: jest.fn().mockReturnValue(''),
  };

  const mockLoadFromLocalStorage = loadFromLocalStorage as jest.MockedFunction<
    typeof loadFromLocalStorage
  >;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockLoadFromLocalStorage.mockReturnValue({} as LastQuery);
  });

  it('should create the search field component', async () => {
    await render(SearchField, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({ search: 'Search' }),
        },
      ],
    });

    const searchInput = screen.getByRole('textbox');
    const searchLabel = screen.getByText(/Search.../i);

    expect(searchInput).toBeTruthy();
    expect(searchLabel).toBeTruthy();
  });

  it('should initialize with value from localStorage when available', async () => {
    const savedQuery = 'saved search term';
    mockLoadFromLocalStorage.mockReturnValue({
      lastQuery: savedQuery,
    } as LastQuery);

    const component = await render(SearchField, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({ search: 'Search' }),
        },
      ],
    });

    expect(mockLoadFromLocalStorage).toHaveBeenCalledWith(
      LAST_SEARCH_QUERY_KEY
    );
    expect(component.fixture.componentInstance.searchControl.value).toBe(
      savedQuery
    );
  });

  it('should emit searchChange after debounce when typing valid search term', async () => {
    const user = userEvent.setup();
    let emittedValue = '';

    const component = await render(SearchField, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({ search: 'Search' }),
        },
      ],
      on: {
        searchChange: (value: string) => {
          emittedValue = value;
        },
      },
    });

    const searchInput = screen.getByRole('textbox');

    await user.type(searchInput, 'nature');

    await waitFor(
      () => {
        expect(emittedValue).toBe('nature');
      },
      { timeout: 1000 }
    );
  });

  it('should emit searchClear when input is cleared', async () => {
    const user = userEvent.setup();
    let clearEmitted = false;

    const component = await render(SearchField, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({ search: 'Search' }),
        },
      ],
      on: {
        searchClear: () => {
          clearEmitted = true;
        },
      },
    });

    const searchInput = screen.getByRole('textbox');

    await user.type(searchInput, 'test');

    await user.clear(searchInput);

    await waitFor(
      () => {
        expect(clearEmitted).toBe(true);
      },
      { timeout: 1000 }
    );
  });

  it('should show clear button when there is search value and not loading', async () => {
    const user = userEvent.setup();

    await render(SearchField, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({ search: 'Search' }),
        },
      ],
      componentInputs: {
        isLoading: false,
      },
    });

    const searchInput = screen.getByRole('textbox');

    await user.type(searchInput, 'test');

    await waitFor(() => {
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      expect(clearButton).toBeTruthy();
    });
  });

  it('should clear search when clear button is clicked', async () => {
    const user = userEvent.setup();
    let clearEmitted = false;

    const component = await render(SearchField, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({ search: 'Search' }),
        },
      ],
      on: {
        searchClear: () => {
          clearEmitted = true;
        },
      },
    });

    const searchInput = screen.getByRole('textbox');

    await user.type(searchInput, 'test');

    await waitFor(() => {
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      expect(clearButton).toBeTruthy();
      return clearButton;
    });

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    await user.click(clearButton);

    expect(component.fixture.componentInstance.searchControl.value).toBe('');
    expect(component.fixture.componentInstance.searchValue()).toBe('');
  });
});
