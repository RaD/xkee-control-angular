import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Credentials } from './interface';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template.html',
  styleUrl: './styles.less'
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

  /**
   * initialize
   * При первом подключении подгружает данные о типе пользователя, его
   * территории, устройства и пользователей. Первым подключением является
   * первичное заполнение локального хранилища браузера. Облако может ничего
   * не возвращать, применяется для миграции клиентов на веб приложение.
   */
  public initialize() {

  }
}
