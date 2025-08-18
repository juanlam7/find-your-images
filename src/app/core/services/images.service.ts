import { HttpClient, HttpResponse } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import type { LastQuery, SearchImagesResult, UnsplashPhoto } from '@core/types';
import { calculateTotalPages } from '@core/utils/calculateTotalPages';
import {
  BASE_API,
  LAST_SEARCH_QUERY_KEY,
  PHOTOS_KEY,
} from '@core/utils/constants';
import { loadFromLocalStorage } from '@core/utils/loadFromLocalStorage';
import { setToLocalStorage } from '@core/utils/setToLocalStorage';
import { finalize, iif, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private readonly http = inject(HttpClient);

  private queryCacheGetImages = new Map<string, HttpResponse<UnsplashPhoto[]>>();
  private queryCacheGetSearchImages = new Map<string, HttpResponse<SearchImagesResult>>();
  private queryCacheGetImageById = new Map<string, UnsplashPhoto>();

  photos = signal<UnsplashPhoto[]>([]);

  private photosPage = signal(1);
  private totalPhotosPage = signal(1);

  isSearchResultEmpty = signal(false);
  isLoadingPhotos = signal(false);

  searchQuery = signal(
    (loadFromLocalStorage(LAST_SEARCH_QUERY_KEY) as LastQuery).lastQuery
  );

  historyKeyQuery = signal<string>('');

  searchHistory = signal<Record<string, UnsplashPhoto[]>>(
    loadFromLocalStorage(PHOTOS_KEY) as Record<string, UnsplashPhoto[]>
  );
  searchHistoryKeys = computed(() =>
    Object.keys(this.searchHistory()).reverse()
  );

  constructor() {
    if (
      !(
        'lastQuery' in
        (loadFromLocalStorage(LAST_SEARCH_QUERY_KEY) as LastQuery)
      )
    )
      this.getImages();
  }

  savePhotosToLocalStorage = effect(() => {
    setToLocalStorage(this.searchHistory(), PHOTOS_KEY);
  });

  saveSearchQueryToLocalStorage = effect(() => {
    setToLocalStorage({ lastQuery: this.searchQuery() }, LAST_SEARCH_QUERY_KEY);
  });

  getImages(): void {
    if (this.isLoadingPhotos() || this.totalPhotosPage() < this.photosPage()) {
      return;
    }

    this.isLoadingPhotos.set(true);
    const url = `/photos?per_page=10&page=${this.photosPage()}`;

    const source$ = iif(
      () => this.queryCacheGetImages.has(url),
      of(this.queryCacheGetImages.get(url)),
      this.http
        .get<UnsplashPhoto[]>(BASE_API + '/photos', {
          observe: 'response',
          params: {
            per_page: 10,
            page: this.photosPage(),
          },
        })
        .pipe(tap((resp) => this.queryCacheGetImages.set(url, resp)))
    );

    source$
      .pipe(finalize(() => this.isLoadingPhotos.set(false)))
      .subscribe((resp) => {
        this.photos.update((currentPhotos) => [
          ...currentPhotos,
          ...(resp?.body ?? []),
        ]);

        const totalPhotosHeader = parseInt(resp?.headers.get('X-Total') ?? '0');
        this.totalPhotosPage.set(calculateTotalPages(totalPhotosHeader, 10));
        this.photosPage.update((page) => page + 1);
      });
  }

  getImageById(id: string): Observable<UnsplashPhoto> {
    if (this.queryCacheGetImageById.has(id)) {
      return of(this.queryCacheGetImageById.get(id)!);
    }

    return this.http
      .get<UnsplashPhoto>(`${BASE_API}/photos/${id}`)
      .pipe(tap((res) => this.queryCacheGetImageById.set(id, res)));
  }

  getSearchImages(query: string): void {
    this.searchQuery.set(query);
    this.isSearchResultEmpty.set(false);
    if (this.totalPhotosPage() < this.photosPage()) return;

    const url = `/search/photos?per_page=10&page=${this.photosPage()}&query=${query}`;

    const source$ = iif(
      () => this.queryCacheGetSearchImages.has(url),
      of(this.queryCacheGetSearchImages.get(url)),
      this.http
        .get<SearchImagesResult>(BASE_API + '/search/photos', {
          observe: 'response',
          params: {
            per_page: 10,
            page: this.photosPage(),
            query,
          },
        })
        .pipe(tap((resp) => this.queryCacheGetSearchImages.set(url, resp)))
    );

    source$.subscribe((resp) => {
      this.photos.update((currentPhotos) => [
        ...currentPhotos,
        ...(resp?.body?.results ?? []),
      ]);

      if (resp?.body?.results.length === 0) this.isSearchResultEmpty.set(true);

      const totalPhotosHeader = parseInt(resp?.headers.get('X-Total') ?? '0');

      this.totalPhotosPage.set(calculateTotalPages(totalPhotosHeader, 10));
      this.photosPage.update((page) => page + 1);

      this.searchHistory.update((history) => ({
        ...history,
        [query.toLowerCase()]: resp?.body?.results ?? [],
      }));
    });
  }

  resetToDefaultValues() {
    this.photos.set([]);
    this.photosPage.set(1);
    this.totalPhotosPage.set(1);
    this.searchQuery.set('');
    this.historyKeyQuery.set('');
    this.isSearchResultEmpty.set(false);
  }
}
