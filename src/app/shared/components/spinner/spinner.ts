import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SpinnerService } from '@core/services/spinner.service';

@Component({
  selector: 'app-spinner',
  imports: [],
  template: `
    @if (isLoading()) {
    <div class="loader-bar" role="progressbar" aria-label="Loading...">
      <div class="loader-progress"></div>
    </div>
    }
  `,
  styleUrl: './spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Spinner {
  private readonly spinnerSvc = inject(SpinnerService);
  isLoading = this.spinnerSvc.isLoading;
}
