import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faWalkieTalkie } from '@fortawesome/free-solid-svg-icons';
import { Area } from '../interfaces';
import { StorageService } from '../storage.service';
import { AreaFormComponent } from '../area-form/component';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    RouterLink,
    AreaFormComponent,
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class AreaComponent {
  // иконки
  faGear = faGear;
  faWalkieTalkie = faWalkieTalkie;

  protected empty: boolean = true;
  protected areas: Area[] = [];

  constructor(
    private localStore: StorageService,
  ) { }

  ngOnInit(): void {
    // проверка списка территорий
    this.areas = this.load_storage();
    this.empty = this.areas.length == 0;
  }

  private load_storage(): Area[] {
    return this.localStore.getAreaList();
  }
}
