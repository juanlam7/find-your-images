import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UnsplashPhoto } from '@core/types';
import { UniquePhotosPipe } from '@shared/pipes/unique-photos.pipe';
import { FavoriteBtn } from '../favorite-btn/favorite-btn';
import { Skeleton } from '../skeleton/skeleton';
import { LazyImage } from '../lazy-image/lazy-image';

@Component({
  selector: 'app-grid',
  imports: [
    RouterLink,
    FavoriteBtn,
    UniquePhotosPipe,
    Skeleton,
    LazyImage,
  ],
  templateUrl: './grid.html',
  styleUrl: './grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grid {
  photos = input.required<UnsplashPhoto[]>();
  redirectRoute = input<string>();
  emptyPhotosText = input.required<string>();
  isLoading = input.required<boolean>();
  isResultEmpty = input.required<boolean>();

  skeletonArray = Array(9).fill(null);
}
