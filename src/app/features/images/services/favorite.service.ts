import { effect, Injectable, signal } from '@angular/core';
import { FAV_PHOTOS_KEY } from '@core/utils/constants';
import { loadFromLocalStorage } from '@core/utils/loadFromLocalStorage';
import { setToLocalStorage } from '@core/utils/setToLocalStorage';
import { FavoriteStorage, UnsplashPhoto } from '../types';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  favoriteList = signal<UnsplashPhoto[]>(
    (loadFromLocalStorage(FAV_PHOTOS_KEY) as FavoriteStorage).data ?? []
  );

  saveFavoritePhotosToLocalStorage = effect(() => {
    setToLocalStorage({ data: this.favoriteList() }, FAV_PHOTOS_KEY);
  });

  addFavorite(newFavorite: UnsplashPhoto) {
    this.favoriteList.update((prev) => [...prev, newFavorite]);
  }

  deleteFavorite(favoriteId: string) {
    this.favoriteList.update((favorite) => {
      return favorite.filter((item) => item.id !== favoriteId);
    });
  }
}
