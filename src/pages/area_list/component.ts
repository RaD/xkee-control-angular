import { Component, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faWalkieTalkie } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../../services/storage';
import { Area } from '../area/interface';
import { SmartButtonComponent } from '../../components/smart-button/component';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [
    FontAwesomeModule,
    RouterLink,
    SmartButtonComponent
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class AreaListPage implements OnInit {
  // иконки
  faGear = faGear;
  faWalkieTalkie = faWalkieTalkie;
  faUser = faUser;
  faPlus = faPlus;

  protected empty: boolean = true;
  protected areas: Area[] = [];

  constructor(
    private localStore: StorageService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    // проверка списка территорий
    this.areas = this.localStore.getAreaList();
    this.empty = this.areas.length == 0;
  }
}
