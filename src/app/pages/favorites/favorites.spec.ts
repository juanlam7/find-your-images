import { provideZonelessChangeDetection, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FavoriteService } from '@core/services/favorite.service';
import { I18N_TOKEN } from '@core/tokens/i18n.token';
import { render, screen, waitFor } from '@testing-library/angular';
import { mockImages } from '../../../mocks/mock-images';
import { Favorites } from './favorites';

describe('Favorites', () => {
  let mockFavoriteService: Partial<FavoriteService>;

  beforeEach(async () => {
    mockFavoriteService = {
      favoriteList: signal([]),
    };

    await render(Favorites, {
      imports: [MatToolbarModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: FavoriteService, useValue: mockFavoriteService },
        {
          provide: I18N_TOKEN,
          useValue: () => ({
            notFavoriteImage: 'You have no favorite images',
          }),
        },
      ],
    });
  });

  it('should display a message when there are no favorite images', async () => {
    expect(
      screen.getByRole('heading', { name: /You have no favorite images/i })
    ).toBeInTheDocument();

    expect(screen.queryByRole('article')).not.toHaveAttribute('app-grid');
  });

  it('should render the grid component when there are favorite images with 10 items', async () => {
    mockFavoriteService.favoriteList?.set(mockImages);

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /You have no favorite images/i })
      ).not.toBeInTheDocument();
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('button', { name: /favorite/i })).toHaveLength(
      10
    );
  });
});
