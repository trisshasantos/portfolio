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
  private ticking = false;

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
    if (this.isBrowser && !this.ticking) {
      requestAnimationFrame(() => {
        this.checkScroll();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private checkScroll() {
    if (!this.isBrowser) {
      return;
    }
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header background change on scroll
    this.isScrolled = scrollTop > 50;
    
    // Auto-hide header logic - more aggressive
    const scrollDifference = Math.abs(scrollTop - this.lastScrollTop);
    
    // Only trigger on significant scroll movement (minimum 5px)
    if (scrollDifference > 5) {
      if (scrollTop > this.lastScrollTop && scrollTop > 80) {
        // Scrolling down - hide header (after 80px scroll)
        this.isHeaderVisible = false;
      } else if (scrollTop < this.lastScrollTop) {
        // Scrolling up - show header immediately
        this.isHeaderVisible = true;
      }
    }
    
    // Always show header at the very top
    if (scrollTop <= 10) {
      this.isHeaderVisible = true;
    }
    
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
