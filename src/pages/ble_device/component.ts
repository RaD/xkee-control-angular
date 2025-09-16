import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faBluetooth, faSignal, faWifi, faBatteryHalf } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../../services/storage';
import { Area } from '../area/interface';

interface BleDevice {
  id: string;
  name: string;
  rssi: number;
  connected: boolean;
  services?: string[];
}

interface DeviceProperty {
  name: string;
  value: string;
  type: 'info' | 'signal' | 'battery' | 'service';
}

@Component({
  selector: 'app-ble-device',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class BleDevicePage implements OnInit {
  faArrowLeft = faArrowLeft;
  faBluetooth = faBluetooth;
  faSignal = faSignal;
  faWifi = faWifi;
  faBatteryHalf = faBatteryHalf;

  protected area_pk: string | null = null;
  protected area: Area | null = null;
  protected device: BleDevice | null = null;
  protected properties: DeviceProperty[] = [];
  protected loading: boolean = false;
  protected error: string = '';

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

    // Get device from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['device']) {
      this.device = navigation.extras.state['device'];
    }
  }

  ngOnInit(): void {
    if (this.device) {
      this.loadDeviceProperties();
    } else {
      this.error = 'Устройство не найдено';
    }
  }

  private loadDeviceProperties(): void {
    if (!this.device) return;

    this.properties = [
      {
        name: 'Название',
        value: this.device.name,
        type: 'info'
      },
      {
        name: 'Идентификатор',
        value: this.device.id,
        type: 'info'
      },
      {
        name: 'Уровень сигнала',
        value: `${this.device.rssi} dBm`,
        type: 'signal'
      },
      {
        name: 'Статус подключения',
        value: this.device.connected ? 'Подключено' : 'Отключено',
        type: 'info'
      },
      {
        name: 'Тип устройства',
        value: 'BLE устройство',
        type: 'info'
      },
      {
        name: 'Протокол',
        value: 'Bluetooth Low Energy',
        type: 'service'
      }
    ];

    // Add mock battery level for demonstration
    if (Math.random() > 0.5) {
      this.properties.push({
        name: 'Уровень батареи',
        value: `${Math.floor(Math.random() * 100)}%`,
        type: 'battery'
      });
    }

    // Add services if available
    if (this.device.services && this.device.services.length > 0) {
      this.properties.push({
        name: 'Сервисы',
        value: this.device.services.join(', '),
        type: 'service'
      });
    }
  }

  protected getPropertyIcon(type: string): any {
    switch (type) {
      case 'signal':
        return this.faSignal;
      case 'battery':
        return this.faBatteryHalf;
      case 'service':
        return this.faWifi;
      default:
        return this.faBluetooth;
    }
  }

  protected getPropertyClass(type: string): string {
    switch (type) {
      case 'signal':
        return 'text-primary';
      case 'battery':
        return 'text-success';
      case 'service':
        return 'text-info';
      default:
        return 'text-secondary';
    }
  }

  protected getRssiClass(rssi: number): string {
    if (rssi > -50) return 'text-success';
    if (rssi > -70) return 'text-warning';
    return 'text-danger';
  }
}