import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.services';
import { Locales } from '@core/types';
import ENGLISH from 'assets/i18n/en.json';
import SPANISH from 'assets/i18n/es.json';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslationService],
    });
    service = TestBed.inject(TranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to English labels', () => {
    expect(service.i18n()).toEqual(ENGLISH);
  });

  it('should switch to Spanish', () => {
    service.switchLanguage(Locales.Es);
    expect(service.i18n()).toEqual(SPANISH);
  });

  it('should switch back to English', () => {
    service.switchLanguage(Locales.Es);
    service.switchLanguage(Locales.En);
    expect(service.i18n()).toEqual(ENGLISH);
  });

  it('should default to English if an unknown locale is passed', () => {
    service.switchLanguage('unknown' as Locales);
    expect(service.i18n()).toEqual(ENGLISH);
  });
});
