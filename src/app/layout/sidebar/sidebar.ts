import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ImagesService } from '@core/services/images.service';
import { TranslationService } from '@core/services/translation.services';
import { I18N_TOKEN } from '@core/tokens/i18n.token';
import { IAppLabels, Locales } from '@core/types';
import { LAST_SEARCH_QUERY_KEY } from '@core/utils/constants';
import { setToLocalStorage } from '@core/utils/setToLocalStorage';
import { ThemePickerComponent } from '@shared/components/theme/theme';

interface MenuOption {
  icon: string;
  label: keyof IAppLabels;
  route: string;
  subLabel: keyof IAppLabels;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    ThemePickerComponent,
    UpperCasePipe
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  imagesServices = inject(ImagesService);
  readonly i18n = inject(I18N_TOKEN);
  readonly languageService = inject(TranslationService);
  readonly router = inject(Router);
  isMenuOpen = signal(false);

  locales = Locales;

  toggleMenu() {
    this.isMenuOpen.update((prev) => !prev);
  }

  menuOptions: MenuOption[] = [
    {
      icon: 'home',
      label: 'home',
      subLabel: 'randomImages',
      route: '/home',
    },
    {
      icon: 'favorite',
      label: 'favorites',
      subLabel: 'favoriteImages',
      route: '/favorites',
    },
  ];

  switchLanguage(lang: Locales) {
    this.languageService.switchLanguage(lang);
  }

  searchByKey(searchKey: string) {
    setToLocalStorage({ lastQuery: searchKey }, LAST_SEARCH_QUERY_KEY);
    this.imagesServices.historyKeyQuery.set(searchKey);
    this.router.navigate(['/home']);
  }
}
