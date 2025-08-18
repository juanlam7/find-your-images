import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FavoriteService } from '@core/services/favorite.service';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { mockImages } from '../../../../mocks/mock-images';
import { FavoriteBtn } from './favorite-btn';

describe('FavoriteBtn Component', () => {
  const mockFavoriteService = {
    favoriteList: jest.fn(),
    addFavorite: jest.fn(),
    deleteFavorite: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [FavoriteBtn],
      providers: [
        provideZonelessChangeDetection(),
        { provide: FavoriteService, useValue: mockFavoriteService },
      ],
    }).compileComponents();
  });

  it('should create the favorite button component', async () => {
    mockFavoriteService.favoriteList.mockReturnValue([]);

    await render(FavoriteBtn, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: FavoriteService, useValue: mockFavoriteService },
      ],
      componentInputs: {
        photo: mockImages[0],
      },
    });

    const favoriteButton = screen.getByRole('button', {
      name: /icon favorite/i,
    });
    expect(favoriteButton).toBeTruthy();
  });

  it('should show unfavorite icon when photo is not in favorites', async () => {
    mockFavoriteService.favoriteList.mockReturnValue([]);

    await render(FavoriteBtn, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: FavoriteService, useValue: mockFavoriteService },
      ],
      componentInputs: {
        photo: mockImages[0],
      },
    });

    const favoriteIcon = screen.getByText('favorite_border');
    expect(favoriteIcon).toBeTruthy();
  });

  it('should show favorite icon when photo is in favorites', async () => {
    mockFavoriteService.favoriteList.mockReturnValue([mockImages[0]]);

    await render(FavoriteBtn, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: FavoriteService, useValue: mockFavoriteService },
      ],
      componentInputs: {
        photo: mockImages[0],
      },
    });

    const favoriteIcon = screen.getByText('favorite');
    expect(favoriteIcon).toBeTruthy();
  });

  it('should apply correct styling when photo is not favorite', async () => {
    mockFavoriteService.favoriteList.mockReturnValue([]);

    await render(FavoriteBtn, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: FavoriteService, useValue: mockFavoriteService },
      ],
      componentInputs: {
        photo: mockImages[0],
      },
    });

    const favoriteButton = screen.getByRole('button', {
      name: /icon favorite/i,
    });

    expect(favoriteButton.style.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(favoriteButton.style.color).toBe('black');
  });

  it('should add photo to favorites when clicking unfavorited photo', async () => {
    const user = userEvent.setup();
    mockFavoriteService.favoriteList.mockReturnValue([]);

    await render(FavoriteBtn, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: FavoriteService, useValue: mockFavoriteService },
      ],
      componentInputs: {
        photo: mockImages[0],
      },
    });

    const favoriteButton = screen.getByRole('button', {
      name: /icon favorite/i,
    });

    await user.click(favoriteButton);

    expect(mockFavoriteService.addFavorite).toHaveBeenCalledWith(mockImages[0]);
    expect(mockFavoriteService.deleteFavorite).not.toHaveBeenCalled();
  });

  it('should remove photo from favorites when clicking favorited photo', async () => {
    const user = userEvent.setup();
    mockFavoriteService.favoriteList.mockReturnValue([mockImages[0]]);

    await render(FavoriteBtn, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: FavoriteService, useValue: mockFavoriteService },
      ],
      componentInputs: {
        photo: mockImages[0],
      },
    });

    const favoriteButton = screen.getByRole('button', {
      name: /icon favorite/i,
    });

    await user.click(favoriteButton);

    expect(mockFavoriteService.deleteFavorite).toHaveBeenCalledWith(
      mockImages[0].id
    );
    expect(mockFavoriteService.addFavorite).not.toHaveBeenCalled();
  });
});
