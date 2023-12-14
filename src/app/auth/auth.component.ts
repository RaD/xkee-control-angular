import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Credentials } from './auth.interface';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.less'
})
export class AuthComponent {
  credentials: Credentials = {
    access: '',
    secret: ''
  };
}
