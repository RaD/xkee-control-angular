import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StorageService } from './storage.service';
import { AreaComponent } from './area/component';
import { NavigationComponent } from './navigation/component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    RouterOutlet, RouterLink, RouterLinkActive,
    NavigationComponent,
    AreaComponent,
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
