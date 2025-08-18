import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ImagesService } from '@core/services/images.service';
import { TranslationService } from '@core/services/translation.services';
import { I18N_TOKEN } from '@core/tokens/i18n.token';
import { Locales } from '@core/types';
import { LAST_SEARCH_QUERY_KEY } from '@core/utils/constants';
import { setToLocalStorage } from '@core/utils/setToLocalStorage';
import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/angular';
import { routes } from '../../app.routes';
import { Sidebar } from './sidebar';

jest.mock('@core/utils/setToLocalStorage');

@Component({
  selector: 'app-theme-picker',
  template: '<div data-testid="mock-theme-picker"></div>',
})
class MockThemePickerComponent {}

jest.mock('@core/services/translation.services', () => ({
  TranslationService: jest.fn().mockImplementation(() => ({
    switchLanguage: jest.fn(),
    getTranslation: jest.fn().mockImplementation((key) => key),
    i18n: jest.fn().mockReturnValue({}),
    getCurrentLanguage: jest.fn(),
  })),
}));

const mockImagesService = {
  searchHistoryKeys: jest.fn().mockReturnValue(['nature', 'sunset']),
  historyKeyQuery: { set: jest.fn() },
};

const mockLanguageService = {
  switchLanguage: jest.fn(),
  getTranslation: jest.fn().mockImplementation((key) => key),
  i18n: jest.fn().mockReturnValue({
    welcome: 'Welcome',
    english: 'English',
    spanish: 'Spanish',
    home: 'Home',
    favorites: 'Favorites',
    randomImages: 'Random Images',
    favoriteImages: 'Favorite Images',
  }),
  getCurrentLanguage: jest.fn(),
};

describe('Sidebar Component', () => {
  let component: RenderResult<Sidebar, Sidebar>;

  beforeEach(async () => {
    component = await render(Sidebar, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: ImagesService, useValue: mockImagesService },
        { provide: TranslationService, useValue: mockLanguageService },
        provideRouter(routes),
        {
          provide: I18N_TOKEN,
          useValue: () => ({
            welcome: 'Welcome',
            english: 'English',
            spanish: 'Spanish',
          }),
        },
      ],
      imports: [MockThemePickerComponent],
    });
  });

  it('should create the sidebar component', async () => {
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeTruthy();
  });

  it('should toggle menu when menu button is clicked', async () => {
    const menuButton = screen.getByRole('button', { name: /menu/i });

    expect(component.fixture.componentInstance.isMenuOpen()).toBe(false);

    fireEvent.click(menuButton);

    expect(component.fixture.componentInstance.isMenuOpen()).toBe(true);
  });

  it('should render welcome message and language buttons', async () => {
    const welcomeHeading = screen.getByRole('heading', { name: /welcome/i });
    const englishButton = screen.getByRole('button', { name: 'EN' });
    const spanishButton = screen.getByRole('button', { name: 'ES' });

    expect(welcomeHeading).toBeTruthy();
    expect(englishButton).toBeTruthy();
    expect(spanishButton).toBeTruthy();
  });

  it('should switch language when language buttons are clicked', async () => {
    const englishButton = screen.getByRole('button', { name: 'EN' });
    const spanishButton = screen.getByRole('button', { name: 'ES' });

    fireEvent.click(englishButton);
    expect(
      component.fixture.componentInstance.languageService.switchLanguage
    ).toHaveBeenCalledWith(Locales.En);

    fireEvent.click(spanishButton);
    expect(
      component.fixture.componentInstance.languageService.switchLanguage
    ).toHaveBeenCalledWith(Locales.Es);
  });

  it('should render navigation menu options', async () => {
    const homeLink = screen.getByRole('link', { name: /home/i });
    const favoritesLink = screen.getByRole('link', { name: /favorites/i });

    expect(homeLink).toBeTruthy();
    expect(favoritesLink).toBeTruthy();
    expect(homeLink.getAttribute('href')).toBe('/home');
    expect(favoritesLink.getAttribute('href')).toBe('/favorites');
  });

  it('should handle search history key click and navigate to home', async () => {
    const mockSetToLocalStorage = setToLocalStorage as jest.MockedFunction<
      typeof setToLocalStorage
    >;

    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    const historyLink = screen.getByText('nature');

    fireEvent.click(historyLink);

    expect(mockSetToLocalStorage).toHaveBeenCalledWith(
      { lastQuery: 'nature' },
      LAST_SEARCH_QUERY_KEY
    );
    expect(mockImagesService.historyKeyQuery.set).toHaveBeenCalledWith(
      'nature'
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});
