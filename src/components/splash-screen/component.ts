import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../app/config';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class SplashScreenComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  
  protected version: string = environment.SOURCE_VERSION;
  protected commit: string = environment.SOURCE_COMMIT;
  protected showContent: boolean = false;
  protected fadeOut: boolean = false;
  
  private timeoutId?: number;

  ngOnInit(): void {
    // Start fade in animation after component is initialized
    setTimeout(() => {
      this.showContent = true;
    }, 100);

    // Auto-navigate after 5 seconds
    this.timeoutId = window.setTimeout(() => {
      this.navigateToApp();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  protected onSplashClick(): void {
    // Allow user to skip splash screen by clicking
    this.navigateToApp();
  }

  private navigateToApp(): void {
    if (this.fadeOut) return; // Prevent multiple calls
    
    this.fadeOut = true;
    
    // Wait for fade out animation to complete before navigating
    setTimeout(() => {
      this.router.navigate(['/areas']);
    }, 500);
  }
}