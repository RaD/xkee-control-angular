import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StorageService } from './storage.service';
import { NavigationComponent } from './navigation/component';
import { AreasComponent } from './areas/component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    RouterOutlet, RouterLink, RouterLinkActive,
    NavigationComponent,
    AreasComponent,
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
