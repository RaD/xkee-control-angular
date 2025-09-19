import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear, faRoad } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

import { StorageService } from '../../services/storage';
import { Area } from '../area/interface';
import { Device } from '../device/interface';
import { SmartButtonComponent } from '../../components/smart-button/component';
import { PageTransitionService } from '../../services/transitions';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    FontAwesomeModule,
    SmartButtonComponent
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class DeviceListPage implements OnInit {
  private pageTransition = inject(PageTransitionService);
  private location = inject(Location);
  private localStore = inject(StorageService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  // иконки
  faGear = faGear;
  faRoad = faRoad;
  faArrowLeft = faArrowLeft;
  faPlus = faPlus;

  protected area_pk: string | null = null;
  protected area: Area | null = null;
  protected empty: boolean = true;
  protected devices: Device[] = [];

  constructor() {
    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      this.area_pk = pk;
      this.area = this.localStore.getArea(pk);
    }
  }

  ngOnInit(): void {
    if (this.area_pk) {
      this.devices = this.localStore.getDeviceList(this.area_pk);
      this.empty = this.devices.length == 0;
    }
  }

  protected navigateBack(): void {
    this.pageTransition.navigateBack(() => {
      this.location.back();
    });
  }

  protected navigateToCreate(): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate(['/areas', this.area?.pk, 'devices', 'create']);
    });
  }

  protected navigateToEdit(device_pk: string): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate(['/areas', this.area?.pk, 'device', device_pk, 'editcreate']);
    });
  }
}
