
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../storage.service';
import { Area } from '../area/interface';
import { Device } from '../device/interface';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    FontAwesomeModule,
    RouterLink
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class DevicesComponent implements OnInit {
  // иконки
  faGear = faGear;

  protected area_pk: string | null = null;
  protected area: Area | null = null;
  protected empty: boolean = true;
  protected devices: Device[] = [];

  constructor(
    private localStore: StorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
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
}
