import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent } from 'rxjs';

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true,
})
export class ScrollNearEndDirective {
  scrollThreshold = input<number>(100);
  nearEnd = output<void>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  constructor() {
    afterNextRender(() => {
      const element = this.elementRef.nativeElement;

      fromEvent(window, 'scroll')
        .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.checkWindowScroll();
        });
    });
  }

  private checkWindowScroll(): void {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (documentHeight - scrollPosition <= this.scrollThreshold()) {
      this.nearEnd.emit();
    }
  }
}
