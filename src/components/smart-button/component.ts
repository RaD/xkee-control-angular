import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-smart-button',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class SmartButtonComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() kind: string = 'primary'; // Bootstrap button styles: primary, secondary, success, danger, warning, info, light, dark
  @Input() icon!: IconDefinition;
  @Input() text: string = '';
  @Input() disabled: boolean = false;
  @Input() size: string = ''; // sm, lg or empty for default

  @ViewChild('buttonElement', { static: false }) buttonElement!: ElementRef;

  protected displayMode: 'icon-only' | 'icon-text' | 'animated' = 'icon-text';
  protected showText: boolean = true;
  protected isAnimating: boolean = false;
  
  private resizeObserver?: ResizeObserver;
  private animationInterval?: number;
  private animationTimeout?: number;
  private readonly minWidthForBoth = 120; // Minimum width to show both icon and text
  private readonly animationMinDelay = 10000; // Minimum delay (10 seconds)
  private readonly animationMaxDelay = 15000; // Maximum delay (15 seconds)
  private readonly animationDuration = 500; // Fade duration
  private readonly iconDisplayDuration = 3000; // How long to show icon (3 seconds)

  ngOnInit(): void {
    // Add random delay to prevent synchronized animations (0-2 seconds)
    const randomDelay = Math.random() * 2000;
    setTimeout(() => {
      this.startAnimationCycle();
    }, randomDelay);
  }

  ngAfterViewInit(): void {
    this.setupResizeObserver();
    this.checkButtonWidth();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private setupResizeObserver(): void {
    if (this.buttonElement && 'ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.checkButtonWidth();
      });
      this.resizeObserver.observe(this.buttonElement.nativeElement);
    }
  }

  private checkButtonWidth(): void {
    if (!this.buttonElement) return;

    // Measure how much space we actually have
    const element = this.buttonElement.nativeElement;
    const computedStyle = window.getComputedStyle(element);
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const paddingRight = parseFloat(computedStyle.paddingRight);
    const availableWidth = element.offsetWidth - paddingLeft - paddingRight;

    // If we have enough space for both icon and text, show both
    if (availableWidth >= this.minWidthForBoth) {
      this.displayMode = 'icon-text';
      this.showText = true;
      this.isAnimating = false;
      this.stopAnimationCycle();
    } else {
      // Not enough space for both - start with text only and animate
      this.displayMode = 'animated';
      this.showText = true; // Always start with text
      this.isAnimating = false;
      this.startAnimationCycle();
    }
  }

  private startAnimationCycle(): void {
    if (this.displayMode !== 'animated') return;

    this.stopAnimationCycle();
    
    // Always start with text visible
    this.showText = true;
    this.isAnimating = false;
    
    const cycleAnimation = () => {
      if (this.displayMode !== 'animated') return;

      // Wait random time between 10-15 seconds, then fade to icon
      const randomDelay = this.animationMinDelay + Math.random() * (this.animationMaxDelay - this.animationMinDelay);
      this.animationTimeout = window.setTimeout(() => {
        if (this.displayMode !== 'animated') return;
        
        // Start fade from text to icon
        this.isAnimating = true;

        // Complete fade to icon
        this.animationTimeout = window.setTimeout(() => {
          if (this.displayMode !== 'animated') return;
          this.showText = false;
          this.isAnimating = false;

          // Show icon for 3 seconds, then fade back to text
          this.animationTimeout = window.setTimeout(() => {
            if (this.displayMode !== 'animated') return;
            
            // Start fade back to text
            this.isAnimating = true;
            
            // Complete fade back to text and start next cycle
            this.animationTimeout = window.setTimeout(() => {
              if (this.displayMode !== 'animated') return;
              this.showText = true;
              this.isAnimating = false;
              
              // Schedule next cycle
              this.animationInterval = window.setTimeout(cycleAnimation, 1000);
            }, this.animationDuration);
          }, this.animationDuration);
        }, this.animationDuration);
      }, randomDelay);
    };

    // Start first cycle
    cycleAnimation();
  }

  private stopAnimationCycle(): void {
    if (this.animationInterval) {
      clearTimeout(this.animationInterval);
      this.animationInterval = undefined;
    }
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = undefined;
    }
  }

  private cleanup(): void {
    this.stopAnimationCycle();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  protected getButtonClasses(): string {
    const baseClass = 'btn';
    const kindClass = `btn-${this.kind}`;
    const sizeClass = this.size ? `btn-${this.size}` : '';
    const smartClass = 'smart-button';
    const modeClass = `smart-button--${this.displayMode}`;
    
    return [baseClass, kindClass, sizeClass, smartClass, modeClass]
      .filter(cls => cls)
      .join(' ');
  }

  protected shouldShowIcon(): boolean {
    return this.displayMode === 'icon-only' || 
           (this.displayMode === 'icon-text') ||
           (this.displayMode === 'animated' && !this.showText);
  }

  protected shouldShowText(): boolean {
    return (this.displayMode === 'icon-text') ||
           (this.displayMode === 'animated' && this.showText);
  }

  protected shouldShowBoth(): boolean {
    return this.displayMode === 'icon-text';
  }
}