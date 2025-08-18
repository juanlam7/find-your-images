import { TestBed } from '@angular/core/testing';
import { FavoriteStorage } from '@core/types';
import { loadFromLocalStorage } from '@core/utils/loadFromLocalStorage';
import { setToLocalStorage } from '@core/utils/setToLocalStorage';
import { mockImages } from '../../../mocks/mock-images';
import { FavoriteService } from './favorite.service';

jest.mock('@core/utils/constants', () => ({
  FAV_PHOTOS_KEY: 'FAV_PHOTOS_KEY',
}));

jest.mock('@core/utils/loadFromLocalStorage');
jest.mock('@core/utils/setToLocalStorage');

describe('FavoriteService', () => {
  let service: FavoriteService;
  let mockLoadFromLocalStorage: jest.MockedFunction<
    typeof loadFromLocalStorage
  >;
  let mockSetToLocalStorage: jest.MockedFunction<typeof setToLocalStorage>;

  const mockPhoto1 = mockImages[0];

  const mockPhoto2 = mockImages[1];

  beforeEach(() => {
    mockLoadFromLocalStorage = loadFromLocalStorage as jest.MockedFunction<
      typeof loadFromLocalStorage
    >;
    mockSetToLocalStorage = setToLocalStorage as jest.MockedFunction<
      typeof setToLocalStorage
    >;

    mockLoadFromLocalStorage.mockClear();
    mockSetToLocalStorage.mockClear();

    TestBed.configureTestingModule({});
  });

  it('should be created and initialize with empty array when localStorage is empty', () => {
    mockLoadFromLocalStorage.mockReturnValue({ data: [] } as FavoriteStorage);

    service = TestBed.inject(FavoriteService);

    expect(service).toBeTruthy();
    expect(service.favoriteList()).toEqual([]);
    expect(mockLoadFromLocalStorage).toHaveBeenCalledWith('FAV_PHOTOS_KEY');
  });

  it('should initialize with data from localStorage when available', () => {
    const existingData = [mockPhoto1, mockPhoto2];
    mockLoadFromLocalStorage.mockReturnValue({
      data: existingData,
    } as FavoriteStorage);

    service = TestBed.inject(FavoriteService);

    expect(service.favoriteList()).toEqual(existingData);
  });

  it('should add a new favorite to the list', () => {
    mockLoadFromLocalStorage.mockReturnValue({ data: [] } as FavoriteStorage);
    service = TestBed.inject(FavoriteService);

    service.addFavorite(mockPhoto1);

    expect(service.favoriteList()).toEqual([mockPhoto1]);
  });

  it('should add multiple favorites maintaining order', () => {
    mockLoadFromLocalStorage.mockReturnValue({ data: [] } as FavoriteStorage);
    service = TestBed.inject(FavoriteService);

    service.addFavorite(mockPhoto1);
    service.addFavorite(mockPhoto2);

    expect(service.favoriteList()).toEqual([mockPhoto1, mockPhoto2]);
  });

  it('should remove favorite by id', () => {
    mockLoadFromLocalStorage.mockReturnValue({
      data: [mockPhoto1, mockPhoto2],
    } as FavoriteStorage);
    service = TestBed.inject(FavoriteService);

    service.deleteFavorite(mockPhoto1.id);

    expect(service.favoriteList()).toEqual([mockPhoto2]);
  });

  it('should trigger localStorage save effect when favorites change', async () => {
    mockLoadFromLocalStorage.mockReturnValue({ data: [] } as FavoriteStorage);
    service = TestBed.inject(FavoriteService);

    service.addFavorite(mockPhoto1);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockSetToLocalStorage).toHaveBeenCalledWith(
      { data: [mockPhoto1] },
      'FAV_PHOTOS_KEY'
    );
  });
});
