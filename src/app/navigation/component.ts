import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class NavigationComponent {
  @Input() has_credentials: boolean = false;
}
