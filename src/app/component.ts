import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../services/storage';
import { NavigationComponent } from '../components/navigation/component';
import { PageTransitionService } from '../services/transitions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    NavigationComponent,
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})

export class AppComponent {
  title: string = 'XKee : Управление';

  constructor(
    private localStore: StorageService,
    private pageTransition: PageTransitionService
  ) { }

  ngOnInit(): void {
    // Disable initial animation
    document.body.classList.add('no-animation');

    // Enable animations after initial load
    setTimeout(() => {
      document.body.classList.remove('no-animation');
    }, 100);
  }
}
