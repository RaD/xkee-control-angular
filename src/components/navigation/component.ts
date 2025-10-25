
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class NavigationComponent {
  @Input() has_credentials: boolean = false;
  @Input() title: string = 'Управление';
}
