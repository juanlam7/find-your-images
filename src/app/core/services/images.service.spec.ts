import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LastQuery, SearchImagesResult } from '@core/types';
import { calculateTotalPages } from '@core/utils/calculateTotalPages';
import { loadFromLocalStorage } from '@core/utils/loadFromLocalStorage';
import { setToLocalStorage } from '@core/utils/setToLocalStorage';
import { mockImages } from '../../../mocks/mock-images';
import { ImagesService } from './images.service';

jest.mock('@core/utils/constants', () => ({
  BASE_API: 'BASE_API',
  LAST_SEARCH_QUERY_KEY: 'LAST_SEARCH_QUERY_KEY',
  PHOTOS_KEY: 'PHOTOS_KEY',
}));

jest.mock('@core/utils/loadFromLocalStorage');
jest.mock('@core/utils/setToLocalStorage');
jest.mock('@core/utils/calculateTotalPages');

describe('ImagesService', () => {
  let service: ImagesService;
  let httpMock: HttpTestingController;
  let mockLoadFromLocalStorage: jest.MockedFunction<
    typeof loadFromLocalStorage
  >;
  let mockSetToLocalStorage: jest.MockedFunction<typeof setToLocalStorage>;
  let mockCalculateTotalPages: jest.MockedFunction<typeof calculateTotalPages>;

  const mockPhoto = mockImages[0];

  beforeEach(() => {
    mockLoadFromLocalStorage = loadFromLocalStorage as jest.MockedFunction<
      typeof loadFromLocalStorage
    >;
    mockSetToLocalStorage = setToLocalStorage as jest.MockedFunction<
      typeof setToLocalStorage
    >;
    mockCalculateTotalPages = calculateTotalPages as jest.MockedFunction<
      typeof calculateTotalPages
    >;

    mockLoadFromLocalStorage.mockImplementation((key) => {
      if (key === 'LAST_SEARCH_QUERY_KEY') return { lastQuery: '' } as LastQuery;
      if (key === 'PHOTOS_KEY') return {};
      return null;
    });
    mockCalculateTotalPages.mockReturnValue(5);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ImagesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created and initialize with empty values', () => {
    expect(service).toBeTruthy();
    expect(service.photos()).toEqual([]);
    expect(service.isLoadingPhotos()).toBe(false);
    expect(service.searchQuery()).toBe('');
  });

  it('should get images and update photos signal', () => {
    const mockPhotos = [mockPhoto];

    service.getImages();

    const req = httpMock.expectOne(`${'BASE_API'}/photos?per_page=10&page=1`);
    expect(req.request.method).toBe('GET');
    expect(service.isLoadingPhotos()).toBe(true);

    req.flush(mockPhotos, {
      headers: { 'X-Total': '50' },
    });

    expect(service.photos()).toEqual(mockPhotos);
    expect(service.isLoadingPhotos()).toBe(false);
    expect(mockCalculateTotalPages).toHaveBeenCalledWith(50, 10);
  });

  it('should get image by id', () => {
    const photoId = 'photo-123';

    service.getImageById(photoId).subscribe((photo) => {
      expect(photo).toEqual(mockPhoto);
    });

    const req = httpMock.expectOne(`${'BASE_API'}/photos/${photoId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPhoto);
  });

  it('should search images and update search history', () => {
    const query = 'nature';
    const mockSearchResult: SearchImagesResult = {
      results: [mockPhoto],
      total: 100,
      total_pages: 10,
    };

    service.getSearchImages(query);

    const req = httpMock.expectOne(
      `${'BASE_API'}/search/photos?per_page=10&page=1&query=${query}`
    );
    expect(req.request.method).toBe('GET');
    expect(service.searchQuery()).toBe(query);

    req.flush(mockSearchResult, {
      headers: { 'X-Total': '100' },
    });

    expect(service.photos()).toEqual(mockSearchResult.results);
    expect(service.searchHistory()[query.toLowerCase()]).toEqual(
      mockSearchResult.results
    );
  });

  it('should reset to default values', () => {
    service.photos.set([mockPhoto]);
    service.searchQuery.set('test');

    service.resetToDefaultValues();

    expect(service.photos()).toEqual([]);
    expect(service.searchQuery()).toBe('');
    expect(service.historyKeyQuery()).toBe('');
  });
});
