import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { I18N_TOKEN } from '@core/tokens/i18n.token';
import { Grid } from '@features/images/components/grid/grid';
import { FavoriteService } from '@features/images/services/favorite.service';

@Component({
  selector: 'app-favorites',
  imports: [Grid, MatToolbarModule],
  template: `<article class="hide-scrollbar">
    <app-grid
      [isLoading]="false"
      [isResultEmpty]="favoriteService.favoriteList().length === 0"
      [emptyPhotosText]="i18n().notFavoriteImage"
      [redirectRoute]="'/images/detail'"
      [photos]="favoriteService.favoriteList()"
    />
  </article>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Favorites {
  favoriteService = inject(FavoriteService);
  readonly i18n = inject(I18N_TOKEN);
}
