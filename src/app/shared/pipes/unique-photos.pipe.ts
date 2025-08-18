import { Pipe, PipeTransform } from '@angular/core';
import { UnsplashPhoto } from '@core/types';

@Pipe({
  name: 'uniquePhotos',
})
export class UniquePhotosPipe implements PipeTransform {
  transform(photos: UnsplashPhoto[]): UnsplashPhoto[] {
    if (!photos || photos.length === 0) {
      return photos;
    }

    const seen = new Set<string>();
    const uniquePhotos: UnsplashPhoto[] = [];

    for (const photo of photos) {
      if (!seen.has(photo.id)) {
        seen.add(photo.id);
        uniquePhotos.push(photo);
      }
    }

    return uniquePhotos;
  }
}
