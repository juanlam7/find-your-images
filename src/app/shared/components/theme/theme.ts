import {
  ChangeDetectionStrategy,
  Component,
  effect,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-theme-picker',
  imports: [MatButtonModule, MatTooltipModule, MatIconModule],
  template: `
    <button mat-icon-button (click)="toggleTheme()" matTooltip="Toggle theme">
      <mat-icon aria-hidden="false" aria-label="icon theme">{{
        mode() === 'dark' ? 'light_mode' : 'dark_mode'
      }}</mat-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent implements OnInit, OnDestroy {
  mode = signal<'light' | 'dark'>('light');
  private unsubscribeSystemTheme?: () => void;

  constructor(private themeService: ThemeService) {
    effect(() => {
      this.themeService.applyTheme(this.mode());
    });
  }

  ngOnInit(): void {
    this.mode.set(this.themeService.getPreferredTheme());

    this.unsubscribeSystemTheme = this.themeService.onSystemThemeChange(
      (theme) => {
        this.mode.set(theme);
        this.themeService.storeTheme(theme);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeSystemTheme?.();
  }

  toggleTheme(): void {
    const newTheme = this.mode() === 'dark' ? 'light' : 'dark';
    this.mode.set(newTheme);
    this.themeService.storeTheme(newTheme);
  }
}
