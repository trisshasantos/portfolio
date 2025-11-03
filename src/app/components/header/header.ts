import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  lastScrollTop = 0;
  isHeaderVisible = true;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Set initial scroll state only in browser
    if (this.isBrowser) {
      this.checkScroll();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.checkScroll();
    }
  }

  private checkScroll() {
    if (!this.isBrowser) {
      return;
    }
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header background change on scroll
    this.isScrolled = scrollTop > 50;
    
    // Auto-hide header logic
    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      // Scrolling down - hide header
      this.isHeaderVisible = false;
    } else {
      // Scrolling up - show header
      this.isHeaderVisible = true;
    }
    
    this.lastScrollTop = scrollTop;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
