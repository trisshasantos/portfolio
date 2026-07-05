import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Header } from './components/header/header';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;
  private routerSub?: Subscription;
  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private zone: NgZone,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Enables the hidden-until-revealed styles only when JS is running,
    // so SSR / no-JS still renders every section fully visible.
    document.body.classList.add('reveal-ready');

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              this.observer?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );

      this.scan();

      this.routerSub = this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => setTimeout(() => this.scan(), 80));
    });
  }

  private scan(): void {
    if (!this.observer) {
      return;
    }
    document
      .querySelectorAll('.reveal:not(.is-revealed), .reveal-stagger:not(.is-revealed)')
      .forEach((el) => this.observer!.observe(el));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.routerSub?.unsubscribe();
  }
}
