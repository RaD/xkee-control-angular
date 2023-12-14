import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LocalService } from './local.service';
import { AuthComponent } from './auth/auth.component';
import { AreaComponent } from './area/area.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, FormsModule,
    AuthComponent, AreaComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})

export class AppComponent {
  title: string = 'control';

  private keys_api: string = 'credentials';
  protected data_api: string | null = null;
  protected has_credentials: boolean = false;

  constructor(private localStore: LocalService) { }

  ngOnInit(): void {
    this.data_api = this.localStore.getData(this.keys_api);
    this.has_credentials = this.data_api != null;
  }

  public event_credentials_set(): void {
    this.has_credentials = true;
  }
}
