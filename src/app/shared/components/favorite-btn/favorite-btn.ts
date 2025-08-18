import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FavoriteService } from '@core/services/favorite.service';
import { UnsplashPhoto } from '@core/types';

@Component({
  selector: 'app-favorite-btn',
  imports: [MatIcon, MatButtonModule, CommonModule],
  templateUrl: './favorite-btn.html',
  styleUrl: './favorite-btn.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteBtn {
  photo = input.required<UnsplashPhoto>();
  favoriteService = inject(FavoriteService);

  isFavorite = computed(() => {
    return this.favoriteService
      .favoriteList()
      .some((item) => item.id === this.photo().id);
  });

  AddFavoriteBtn() {
    this.favoriteService.addFavorite(this.photo());
  }
  deleteFavoriteBtn() {
    this.favoriteService.deleteFavorite(this.photo().id);
  }
}
