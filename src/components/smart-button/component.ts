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
  private readonly minWidthForText = 120; // Minimum width to show text
  private readonly minWidthForAnimation = 80; // Minimum width for animation
  private readonly animationDelay = 3000; // Base delay between animations
  private readonly animationDuration = 500; // Fade duration
  private readonly textDisplayDuration = 2000; // How long to show text during animation

  ngOnInit(): void {
    // Add random delay to prevent synchronized animations
    const randomDelay = Math.random() * 2000; // 0-2 seconds random delay
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

    const buttonWidth = this.buttonElement.nativeElement.offsetWidth;
    const parentWidth = this.buttonElement.nativeElement.parentElement?.offsetWidth || buttonWidth;
    const availableWidth = Math.min(buttonWidth, parentWidth);

    if (availableWidth < this.minWidthForAnimation) {
      this.displayMode = 'icon-only';
      this.showText = false;
      this.isAnimating = false;
      this.stopAnimationCycle();
    } else if (availableWidth >= this.minWidthForText) {
      this.displayMode = 'icon-text';
      this.showText = true;
      this.isAnimating = false;
      this.stopAnimationCycle();
    } else {
      this.displayMode = 'animated';
      this.startAnimationCycle();
    }
  }

  private startAnimationCycle(): void {
    if (this.displayMode !== 'animated') return;

    this.stopAnimationCycle();
    
    const cycleAnimation = () => {
      if (this.displayMode !== 'animated') return;

      // Start with text visible
      this.showText = true;
      this.isAnimating = false;

      // After text display duration, start fade to icon
      this.animationTimeout = window.setTimeout(() => {
        if (this.displayMode !== 'animated') return;
        
        this.isAnimating = true;
        this.showText = false;

        // After animation duration, show icon for a while, then fade back to text
        this.animationTimeout = window.setTimeout(() => {
          if (this.displayMode !== 'animated') return;
          
          this.isAnimating = true;
          this.showText = true;

          // Complete the cycle
          this.animationTimeout = window.setTimeout(() => {
            this.isAnimating = false;
            // Schedule next cycle with some randomness
            const nextDelay = this.animationDelay + (Math.random() * 1000); // Add 0-1s randomness
            this.animationInterval = window.setTimeout(cycleAnimation, nextDelay);
          }, this.animationDuration);
        }, this.textDisplayDuration);
      }, this.textDisplayDuration);
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