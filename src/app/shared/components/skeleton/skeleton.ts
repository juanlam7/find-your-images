import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  imports: [],
  template: `<figure class="skeleton">
    <div class="skeleton-image"></div>
  </figure>`,
  styleUrl: './skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Skeleton {
}
