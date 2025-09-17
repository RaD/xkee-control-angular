import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../services/storage';
import { NavigationComponent } from '../components/navigation/component';
import { PageTransitionService } from '../services/transitions';
import { environment } from './config';

const BACKEND_URL = (window as any)?.env?.APP_BACKEND_URL || 'https://backend.xkee.ru';

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
  version: string = environment.SOURCE_VERSION;
  commit: string = environment.SOURCE_COMMIT;

  constructor(
    private localStore: StorageService,
    private pageTransition: PageTransitionService
  ) { }

  ngOnInit(): void {
    console.log('Backend:', BACKEND_URL);
    console.log('Version:', this.version);
    console.log('Commit:', this.commit);

    // Disable initial animation
    document.body.classList.add('no-animation');

    // Enable animations after initial load
    setTimeout(() => {
      document.body.classList.remove('no-animation');
    }, 100);
  }
}
