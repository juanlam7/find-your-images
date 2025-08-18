import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ImagesService } from '@core/services/images.service';
import { TranslationService } from '@core/services/translation.services';
import { I18N_TOKEN } from '@core/tokens/i18n.token';
import { LastQuery } from '@core/types';
import { LAST_SEARCH_QUERY_KEY } from '@core/utils/constants';
import { loadFromLocalStorage } from '@core/utils/loadFromLocalStorage';
import type { SearchConfig } from '@shared/types/searcher.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-field',
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './searcher.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchField implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  imagesServices = inject(ImagesService);
  readonly i18n = inject(I18N_TOKEN);
  readonly languageService = inject(TranslationService);

  config = input<SearchConfig>({
    debounceTime: 500,
    minSearchLength: 2,
    appearance: 'fill',
    showClearButton: true,
  });

  initialValue = input<string>('');
  disabled = input<boolean>(false);
  isLoading = input<boolean>(false);

  searchChange = output<string>();
  searchClear = output<void>();

  searchValue = signal<string>('');

  searchControl = new FormControl('');

  constructor() {
    effect(() => {
      const initial = this.initialValue();
      if (initial && initial !== this.searchValue()) {
        this.searchControl.setValue(initial);
        this.searchValue.set(initial);
      }
    });

    effect(() => {
      const isDisabled = this.disabled();
      if (isDisabled) {
        this.searchControl.disable();
      } else {
        this.searchControl.enable();
      }
    });
    effect(() => {
      const stateQuery = this.imagesServices.historyKeyQuery();
      if (stateQuery.length > 0) {
        this.setValue(stateQuery);
      }
    });
  }

  ngOnInit(): void {
    this.setupSearchSubscription();
    const loadQuery = loadFromLocalStorage(LAST_SEARCH_QUERY_KEY) as LastQuery;

    if ('lastQuery' in loadQuery) {
      const { lastQuery } = loadQuery;
      this.setValue(lastQuery);
    }
  }

  private setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.config().debounceTime || 500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        const searchTerm = (value || '').trim();
        this.searchValue.set(searchTerm);

        const minLength = this.config().minSearchLength || 0;

        if (searchTerm.length === 0) {
          this.searchClear.emit();
        } else if (searchTerm.length >= minLength) {
          this.searchChange.emit(searchTerm);
        }
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.searchValue.set('');
  }

  setValue(value: string): void {
    this.searchControl.setValue(value);
  }
}
