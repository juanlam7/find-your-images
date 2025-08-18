import { provideZonelessChangeDetection } from '@angular/core';
import { ImagesService } from '@core/services/images.service';
import { SpinnerService } from '@core/services/spinner.service';
import { render, screen } from '@testing-library/angular';
import { Home } from './home';

import { TranslationService } from '@core/services/translation.services';
import { I18N_TOKEN } from '@core/tokens/i18n.token';

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

const mockImagesService = {
  searchQuery: jest.fn(),
  getSearchImages: jest.fn(),
  getImages: jest.fn(),
  resetToDefaultValues: jest.fn(),
  photos: jest.fn().mockReturnValue([]),
  isLoadingPhotos: jest.fn().mockReturnValue(false),
  historyKeyQuery: jest.fn().mockReturnValue(''),
  isSearchResultEmpty: jest.fn().mockReturnValue(false),
};

const mockSpinnerService = {
  isLoading: jest.fn().mockReturnValue(false),
  show: jest.fn(),
  hide: jest.fn(),
};

describe('Home Component', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should create the home component', async () => {
    const { container } = await render(Home, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({
            search: 'Search',
          }),
        },
      ],
    });

    const gridComponent = container.querySelectorAll('.grid-item.skeleton');
    const searchComponent = screen.getByLabelText('Search...');

    expect(gridComponent).toBeTruthy();
    expect(searchComponent).toBeTruthy();
  });

  it('should load more images when search query exists', async () => {
    mockImagesService.searchQuery.mockReturnValue('nature');

    const component = await render(Home, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({
            search: 'Search',
          }),
        },
      ],
    });

    component.fixture.componentInstance.loadMore();

    expect(mockImagesService.searchQuery).toHaveBeenCalled();
    expect(mockImagesService.getSearchImages).toHaveBeenCalledWith('nature');
    expect(mockImagesService.getImages).not.toHaveBeenCalled();
  });

  it('should load default images when no search query exists', async () => {
    mockImagesService.searchQuery.mockReturnValue('');

    const component = await render(Home, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({
            search: 'Search',
          }),
        },
      ],
    });

    component.fixture.componentInstance.loadMore();

    expect(mockImagesService.searchQuery).toHaveBeenCalled();
    expect(mockImagesService.getImages).toHaveBeenCalled();
    expect(mockImagesService.getSearchImages).not.toHaveBeenCalled();
  });

  it('should handle search with a new query', async () => {
    const searchValue = 'mountains';

    const component = await render(Home, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({
            search: 'Search',
          }),
        },
      ],
    });

    component.fixture.componentInstance.onSearch(searchValue);

    expect(mockImagesService.resetToDefaultValues).toHaveBeenCalled();
    expect(mockImagesService.getSearchImages).toHaveBeenCalledWith(searchValue);
  });

  it('should handle search clear and load default images', async () => {
    mockImagesService.searchQuery.mockReturnValue('');

    const component = await render(Home, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({
            search: 'Search',
          }),
        },
      ],
    });

    component.fixture.componentInstance.onSearchClear();

    expect(mockImagesService.resetToDefaultValues).toHaveBeenCalled();
    expect(mockImagesService.getImages).toHaveBeenCalled();
  });

  it('should have access to injected services', async () => {
    const component = await render(Home, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({
            search: 'Search',
          }),
        },
      ],
    });

    expect(component.fixture.componentInstance.imagesServices).toBe(
      mockImagesService
    );
    expect(component.fixture.componentInstance.spinnerService).toBe(
      mockSpinnerService
    );
  });
});
