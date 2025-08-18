import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { ImagesService } from '@core/services/images.service';
import { I18N_TOKEN } from '@core/tokens/i18n.token';
import { fireEvent, render, screen } from '@testing-library/angular';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { mockImages } from '../../../mocks/mock-images';
import { routes } from '../../app.routes';
import { Detail } from './detail';

jest.mock('@core/services/translation.services', () => ({
  TranslationService: jest.fn().mockImplementation(() => ({
    switchLanguage: jest.fn(),
    getTranslation: jest.fn().mockImplementation((key) => key),
    i18n: jest.fn().mockReturnValue({}),
  })),
}));

describe('Detail Component', () => {
  let mockImagesService: Partial<ImagesService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let paramsSubject: BehaviorSubject<{ id: string }>;

  beforeEach(async () => {
    paramsSubject = new BehaviorSubject({ id: '123' });
    mockActivatedRoute = {
      params: paramsSubject.asObservable(),
    };

    mockImagesService = {
      getImageById: jest.fn(() => of(mockImages[0])),
    };

    window.open = jest.fn();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.useFakeTimers();

    await render(Detail, {
      imports: [],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ImagesService, useValue: mockImagesService },
        provideRouter(routes),
        {
          provide: I18N_TOKEN,
          useValue: () => ({
            imageNotFound: 'Image not found',
            providedImageId: 'The provided image ID does not exist',
            redirectingHome: 'Redirecting to home',
            description: 'Description',
            photoDetails: 'Photo Details',
            likes: 'Likes',
            dimensions: 'Dimensions',
            created: 'Created',
            updated: 'Updated',
            aboutPhotographer: 'About the Photographer',
            photographerStats: 'Photographer Stats',
            collections: 'Collections',
            location: 'Location',
            download: 'Download',
            viewOnUnsplash: 'View on Unsplash',
            photographerPortfolio: 'Photographer Portfolio',
          }),
        },
      ],
    });
  });

  it('should render the photo details correctly', async () => {
    await screen.findByRole('img', { name: /Photo by Annie Spratt/i });

    const mainImage = screen.getByRole('img', {
      name: /Photo by Annie Spratt/i,
    });
    expect(mainImage).toHaveAttribute(
      'src',
      'https://images.unsplash.com/photo-1754756736142-b5251258b167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTA1MzZ8MHwxfGFsbHwxfHx8fHx8fHwxNzU0OTQ4MDM2fA&ixlib=rb-4.1.0&q=80&w=1080'
    );

    expect(
      screen.getByRole('heading', { name: 'Annie Spratt' })
    ).toBeInTheDocument();
    expect(screen.getByText('@anniespratt')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Hobbyist photographer from England, sharing my digital, film, vintage scans and illustrations 🫶🏻'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('67')).toBeInTheDocument();
    expect(screen.getByText('5219 × 7824')).toBeInTheDocument();
    expect(screen.getByText('Aug 9, 2025')).toBeInTheDocument();
    expect(screen.getByText('Aug 11, 2025')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Download/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /View on Unsplash/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Photographer Portfolio/i })
    ).toBeInTheDocument();
  });

  it('should open a new window for external links', () => {
    const downloadButton = screen.getByRole('button', { name: /Download/i });
    const unsplashButton = screen.getByRole('button', {
      name: /View on Unsplash/i,
    });
    const portfolioButton = screen.getByRole('button', {
      name: /Photographer Portfolio/i,
    });

    fireEvent.click(downloadButton);
    expect(window.open).toHaveBeenCalledWith(
      'https://unsplash.com/photos/XgXxJVyP1vA/download?ixid=M3w3OTA1MzZ8MHwxfGFsbHwxfHx8fHx8fHwxNzU0OTQ4MDM2fA',
      '_blank'
    );

    fireEvent.click(unsplashButton);
    expect(window.open).toHaveBeenCalledWith(
      'https://unsplash.com/photos/XgXxJVyP1vA',
      '_blank'
    );

    fireEvent.click(portfolioButton);
    expect(window.open).toHaveBeenCalledWith(
      'https://www.anniespratt.com',
      '_blank'
    );

    expect(window.open).toHaveBeenCalledTimes(3);
  });
});

describe('when the image is not found', () => {
  let mockImagesService: Partial<ImagesService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let router: Router;
  let paramsSubject: BehaviorSubject<{ id: string }>;

  beforeEach(async () => {
    paramsSubject = new BehaviorSubject({ id: '123' });
    mockActivatedRoute = {
      params: paramsSubject.asObservable(),
    };

    mockImagesService = {
      getImageById: jest.fn(() => of(mockImages[0])),
    };
    mockImagesService.getImageById = jest.fn(() =>
      throwError(() => new Error('Not found'))
    );

    jest.useFakeTimers();

    await render(Detail, {
      imports: [],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ImagesService, useValue: mockImagesService },
        provideRouter(routes),
        {
          provide: I18N_TOKEN,
          useValue: () => ({
            imageNotFound: 'Image not found',
            providedImageId: 'The provided image ID does not exist',
            redirectingHome: 'Redirecting to home',
          }),
        },
      ],
    });

    router = TestBed.inject(Router);
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should display an error message and redirect to home', async () => {
    await screen.findByRole('heading', { name: /Image not found/i });

    expect(screen.getByText('Image not found')).toBeInTheDocument();
    expect(screen.getByText(/The provided image ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Redirecting to home/i)).toBeInTheDocument();

    const navigateSpy = jest.spyOn(router, 'navigate');

    jest.runAllTimers();

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
