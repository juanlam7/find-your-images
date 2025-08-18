import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FavoriteService } from '@core/services/favorite.service';
import { I18N_TOKEN } from '@core/tokens/i18n.token';
import { Grid } from '@shared/components/grid/grid';

@Component({
  selector: 'app-favorites',
  imports: [Grid, MatToolbarModule],
  template: `<article class="hide-scrollbar">
    <app-grid
      [isLoading]="false"
      [isResultEmpty]="favoriteService.favoriteList().length === 0"
      [emptyPhotosText]="i18n().notFavoriteImage"
      [redirectRoute]="'/detail'"
      [photos]="favoriteService.favoriteList()"
    />
  </article>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Favorites {
  favoriteService = inject(FavoriteService);
  readonly i18n = inject(I18N_TOKEN);
}
