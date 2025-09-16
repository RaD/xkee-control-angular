import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../services/storage';
import { NavigationComponent } from '../components/navigation/component';

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

  constructor(private localStore: StorageService) { }

  ngOnInit(): void {
  }
}
