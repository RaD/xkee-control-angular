import { Component, OnInit } from '@angular/core';

import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../../services/storage';
import { Area } from '../area/interface';
import { Device } from './interface';
import { SmartButtonComponent } from '../../components/smart-button/component';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    FontAwesomeModule,
    SmartButtonComponent
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class DevicePage implements OnInit {
  faSave = faSave;
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;

  protected fields: Device;
  protected area: Area | null = null;
  protected device: Device | null = null;
  protected action: string | null = null;

  constructor(
    private localStore: StorageService,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    this.fields = new Device('', '', '');
    const pk = this.route.snapshot.paramMap.get('pk');
    const device_pk = this.route.snapshot.paramMap.get('device_pk');
    this.action = this.route.snapshot.paramMap.get('action');
    if (pk) {
      this.area = this.localStore.getArea(pk);
    }
    if (device_pk) {
      this.device = this.localStore.getDevice(device_pk);
    }
  }

  ngOnInit(): void {
    if (this.area?.pk != null && this.device?.pk && this.action != null) {
      if (this.action === 'delete') {
        this.localStore.removeDevice(this.device.pk, this.area.pk);
        // возвращаемся на список
        this.router.navigate(['/areas', this.area.pk, 'devices']);
      } else {
        this.fields = new Device(
          this.device.pk, this.device.title, this.device?.description);
      }
    }
  }

  protected showPk(): boolean {
    return this.action == null;
  }

  /**
   * onSubmit
   * Обработка отправки формы
   */
  public onSubmit(): void {
    let area_pk = this.area?.pk;
    if (area_pk) {
      let pk: string = this.fields.pk;
      let device: Device = new Device(
        this.fields.pk,
        this.fields.title,
        this.fields.description,
      );
      this.localStore.setDevice(pk, area_pk, device);
    }
    // возвращаемся на список
    this.router.navigate(['/areas', area_pk, 'devices']);
  }
}
