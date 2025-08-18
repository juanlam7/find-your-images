import { Injectable, signal } from '@angular/core';
import { IAppLabels, Locales } from '@core/types';
import ENGLISH from 'assets/i18n/en.json';
import SPANISH from 'assets/i18n/es.json';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  readonly i18n = signal<IAppLabels>(ENGLISH as IAppLabels);

  switchLanguage(lang: Locales) {
    switch (lang) {
      case Locales.Es:
        this.i18n.set(SPANISH as IAppLabels);
        break;
      case Locales.En:
      default:
        this.i18n.set(ENGLISH as IAppLabels);
    }
  }

  getCurrentLanguage(): Locales {
    if (this.i18n().spanish === ENGLISH.spanish) {
      return Locales.En;
    }

    if (this.i18n().spanish === SPANISH.spanish) {
      return Locales.Es;
    }

    return Locales.En;
  }

  getTranslation(key: keyof IAppLabels): string {
    return this.i18n()[key] || key;
  }
}
