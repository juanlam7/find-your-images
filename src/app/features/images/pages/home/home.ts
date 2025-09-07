import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SpinnerService } from '@core/services/spinner.service';
import { I18N_TOKEN } from '@core/tokens/i18n.token';
import { Grid } from '@features/images/components/grid/grid';
import { SearchField } from '@features/images/components/searcher/searcher';
import { ImagesService } from '@features/images/services/images.service';
import { ScrollNearEndDirective } from '@shared/directives/scroll-near-end.directive';

@Component({
  selector: 'app-home',
  imports: [Grid, SearchField, ScrollNearEndDirective],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  imagesServices = inject(ImagesService);
  spinnerService = inject(SpinnerService);
  readonly i18n = inject(I18N_TOKEN);

  loadMore() {
    const currentQuery = this.imagesServices.searchQuery();
    if (currentQuery) {
      this.imagesServices.getSearchImages(currentQuery);
      return;
    }
    this.imagesServices.getImages();
  }

  onSearch(value: string) {
    this.imagesServices.resetToDefaultValues();
    this.imagesServices.getSearchImages(value);
  }

  onSearchClear() {
    this.imagesServices.resetToDefaultValues();
    this.loadMore();
  }
}
