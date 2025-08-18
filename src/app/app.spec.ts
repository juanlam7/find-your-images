import { provideZonelessChangeDetection } from '@angular/core';
import { ImagesService } from '@core/services/images.service';
import { render, screen } from '@testing-library/angular';
import { App } from './app';
import { TranslationService } from './core/services/translation.services';
import { I18N_TOKEN } from './core/tokens/i18n.token';

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
  getCurrentLanguage: jest.fn()
};

const mockImagesService = {
  searchHistoryKeys: jest.fn().mockReturnValue(['nature', 'sunset']),
  historyKeyQuery: { set: jest.fn() },
};

describe('App', () => {
  it('should render all the required literal text in the document', async () => {
    await render(App, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: TranslationService, useValue: mockLanguageService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({
            search: 'Search',
          }),
        },
      ],
    });

    expect(screen.getByText('menu')).toBeInTheDocument();
    expect(screen.getByText('Toggle theme')).toBeInTheDocument();
    expect(screen.getByText('dark_mode')).toBeInTheDocument();
    expect(screen.getByText('randomImages')).toBeInTheDocument();
    expect(screen.getByText('favorites')).toBeInTheDocument();
    expect(screen.getByText('favoriteImages')).toBeInTheDocument();
    expect(screen.getByText('nature')).toBeInTheDocument();
    expect(screen.getByText('sunset')).toBeInTheDocument();
  });
});
