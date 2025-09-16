import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageTransitionService {
  private isAnimating = false;

  constructor() {}

  /**
   * Animate page transition with swipe effect
   * @param direction - 'left' for forward navigation, 'right' for back navigation
   * @param callback - Function to execute during transition (navigation)
   */
  animatePageTransition(direction: 'left' | 'right', callback: () => void): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    const body = document.body;
    const animationClass = direction === 'left' ? 'page-swipe-left' : 'page-swipe-right';
    
    // Add animation class
    body.classList.add(animationClass);
    
    // Execute navigation after a short delay to start the animation
    setTimeout(() => {
      callback();
      
      // Remove animation class after transition completes
      setTimeout(() => {
        body.classList.remove(animationClass);
        this.isAnimating = false;
      }, 300); // Match CSS transition duration
    }, 50);
  }

  /**
   * Navigate forward with left swipe animation
   */
  navigateForward(callback: () => void): void {
    this.animatePageTransition('left', callback);
  }

  /**
   * Navigate back with right swipe animation
   */
  navigateBack(callback: () => void): void {
    this.animatePageTransition('right', callback);
  }
}