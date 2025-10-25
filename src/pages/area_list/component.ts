import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faWalkieTalkie } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { StorageService } from '../../services/storage';
import { Area } from '../area/interface';
import { SmartButtonComponent } from '../../components/smart-button/component';
import { PageTransitionService } from '../../services/transitions';
import { environment } from '../../app/config';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [
    FontAwesomeModule,
    SmartButtonComponent
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class AreaListPage implements OnInit {
  private pageTransition = inject(PageTransitionService);
  private localStore = inject(StorageService);
  private router = inject(Router);

  // иконки
  faGear = faGear;
  faWalkieTalkie = faWalkieTalkie;
  faUser = faUser;
  faPlus = faPlus;

  protected empty: boolean = true;
  protected areas: Area[] = [];
  protected version: string = environment.SOURCE_VERSION;
  protected commit: string = environment.SOURCE_COMMIT;

  ngOnInit(): void {
    // проверка списка территорий
    this.areas = this.localStore.getAreaList();
    this.empty = this.areas.length == 0;
  }

  protected navigateToCreate(): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate(['/areas/create']);
    });
  }

  protected navigateToCustomers(area: Area): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate(['/areas', area.pk, 'customers']);
    });
  }

  protected navigateToDevices(area: Area): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate(['/areas', area.pk, 'devices']);
    });
  }

  protected navigateToSettings(area: Area): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate(['/areas', area.pk, 'edit']);
    });
  }
}
