import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private readonly storageKey = 'docs-theme-storage-current-name';
  private mediaQuery: MediaQueryList | null = null;

  constructor() {
    this.renderer = inject(RendererFactory2).createRenderer(null, null);

    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    }
  }

  getPreferredTheme(): 'light' | 'dark' {
    const stored = this.getStoredThemeName();
    if (stored) return stored;
    return this.mediaQuery?.matches ? 'dark' : 'light';
  }

  onSystemThemeChange(callback: (theme: 'light' | 'dark') => void): () => void {
    if (!this.mediaQuery) return () => {};
    const listener = (e: MediaQueryListEvent) =>
      callback(e.matches ? 'dark' : 'light');

    this.mediaQuery.addEventListener('change', listener);
    return () => this.mediaQuery?.removeEventListener('change', listener);
  }

  applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const opposite = theme === 'dark' ? 'light-theme' : 'dark-theme';

    this.renderer.removeClass(root, opposite);
    this.renderer.addClass(root, `${theme}-theme`);
    this.renderer.setStyle(root, 'color-scheme', theme);
  }

  storeTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch {}
  }

  private getStoredThemeName(): 'light' | 'dark' | null {
    try {
      const theme = localStorage.getItem(this.storageKey);
      return theme === 'dark' || theme === 'light' ? theme : null;
    } catch {
      return null;
    }
  }

  clearStorage(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {}
  }
}
