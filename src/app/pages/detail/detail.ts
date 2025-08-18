import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagesService } from '@core/services/images.service';
import { I18N_TOKEN } from '@core/tokens/i18n.token';
import { Skeleton } from "@shared/components/skeleton/skeleton";
import { PhotoResult } from '@shared/types/common';
import { catchError, map, of } from 'rxjs';
import { LazyImage } from "@shared/components/lazy-image/lazy-image";
import { FavoriteBtn } from "@shared/components/favorite-btn/favorite-btn";

@Component({
  selector: 'app-detail',
  imports: [MatCardModule, MatButtonModule, DatePipe, DecimalPipe, Skeleton, LazyImage, FavoriteBtn],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Detail {
  private imagesService = inject(ImagesService);
  private router = inject(Router);
  readonly i18n = inject(I18N_TOKEN);

  id = toSignal<string>(
    inject(ActivatedRoute).params.pipe(map((params) => params['id']))
  );

  photoResult = toSignal(
    this.imagesService.getImageById(this.id() ?? '').pipe(
      map((photo) => ({ photo, error: false, loading: false } as PhotoResult)),
      catchError((error) => {
        console.error('Error fetching photo:', error);
        return of({ photo: null, error: true, loading: false } as PhotoResult);
      })
    ),
    {
      initialValue: { photo: null, error: false, loading: true } as PhotoResult,
    }
  );

  constructor() {
    effect(() => {
      const result = this.photoResult();
      if (result?.error) {
        alert(`Image with ID "${this.id()}" not found. Redirecting to home...`);
        setTimeout(() => this.router.navigate(['/']), 2000);
      }
    });
  }

  downloadImage(downloadUrl: string): void {
    window.open(downloadUrl, '_blank');
  }

  openUnsplash(htmlUrl: string): void {
    window.open(htmlUrl, '_blank');
  }

  openPortfolio(portfolioUrl: string): void {
    window.open(portfolioUrl, '_blank');
  }
}
