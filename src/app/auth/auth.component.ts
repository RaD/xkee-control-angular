import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Credentials } from './auth.interface';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.less'
})
export class AuthComponent {
  key_name: string = 'credentials';
  public credentials: Credentials = {
    access: '',
    secret: ''
  };

  @Output() credentialsSet = new EventEmitter();

  /**
   * store_credentials
   */
  public store_credentials(): void {
    let data = {
      'access': this.credentials.access,
      'secret': this.credentials.secret
    };
    localStorage.setItem(this.key_name, JSON.stringify(data))
    this.credentialsSet.emit();
  }

  /**
   * clear_credentials
   */
  public clear_credentials(): void {
    localStorage.removeItem(this.key_name);
  }
}
