import { Component, input } from '@angular/core';

@Component({
  selector: 'app-lazy-image',
  template: `
   <div 
      class="image-wrapper" 
      [class.avatar-wrapper]="isAvatar()"
      [style.aspect-ratio]="aspectRatio()">
      <img 
        [src]="src()" 
        [alt]="alt()"
        loading="lazy"
        [class]="getImageClasses()" />
    </div>
  `,
  styleUrls: ['./lazy-image.css'],
})
export class LazyImage {
  src = input<string>('');
  alt = input<string>('');
  imageClass = input<string>('');
  aspectRatio = input<string>('1 / 1');

  isAvatar(): boolean {
    return this.imageClass().includes('avatar');
  }

  getImageClasses(): string {
    return this.imageClass ? `lazy-image ${this.imageClass()}` : 'lazy-image';
  }
}
