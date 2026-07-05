import { Directive, ElementRef, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Animates a number from 0 to a target when it scrolls into view.
 * SSR-safe: renders the final value immediately when not in a browser.
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, OnDestroy {
  @Input('appCountUp') target = 0;
  @Input() countDuration = 1600;
  @Input() countSuffix = '';

  private observer?: IntersectionObserver;
  private started = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      this.render(this.target);
      return;
    }

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      this.render(this.target);
      return;
    }

    // Stabilize layout: equal-width figures + a min-width reserved from the
    // final value so the number never reflows / jitters while counting.
    const host = this.el.nativeElement;
    host.style.display = 'inline-block';
    host.style.textAlign = 'right';
    host.style.whiteSpace = 'nowrap';
    host.style.fontVariantNumeric = 'tabular-nums';
    host.style.fontFeatureSettings = "'tnum'";
    this.render(this.target);
    host.style.minWidth = `${host.getBoundingClientRect().width}px`;
    this.render(0);

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !this.started) {
            this.started = true;
            this.animate();
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  private animate(): void {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / this.countDuration);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.render(Math.round(this.target * eased));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.render(this.target);
      }
    };
    requestAnimationFrame(step);
  }

  private render(value: number): void {
    this.el.nativeElement.textContent = value.toLocaleString('en-US') + this.countSuffix;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
