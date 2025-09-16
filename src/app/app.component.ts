import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StorageService } from './storage.service';
import { NavigationComponent } from './navigation/component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    NavigationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})

export class AppComponent {
  title: string = 'XKee : Управление';

  constructor(private localStore: StorageService) { }

  ngOnInit(): void {
  }
}
