import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBluetooth } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faSync, faSignal } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../../services/storage';
import { Area } from '../area/interface';

interface BleDevice {
  id: string;
  name: string;
  rssi: number;
  connected: boolean;
  services?: string[];
}

@Component({
  selector: 'app-ble-list',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class BleListPage implements OnInit {
  faArrowLeft = faArrowLeft;
  faSync = faSync;
  faBluetooth = faBluetooth;
  faSignal = faSignal;

  protected area_pk: string | null = null;
  protected area: Area | null = null;
  protected devices: BleDevice[] = [];
  protected scanning: boolean = false;
  protected bluetoothSupported: boolean = false;
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
  }

  ngOnInit(): void {
    this.checkBluetoothSupport();
  }

  private checkBluetoothSupport(): void {
    if ('bluetooth' in navigator) {
      this.bluetoothSupported = true;
    } else {
      this.error = 'Bluetooth не поддерживается в этом браузере';
    }
  }

  protected async onRefresh(): Promise<void> {
    if (!this.bluetoothSupported || this.scanning) {
      return;
    }

    this.scanning = true;
    this.error = '';
    this.devices = [];

    try {
      // Request Bluetooth device scan
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information']
      });

      if (device) {
        const bleDevice: BleDevice = {
          id: device.id || Math.random().toString(36).substr(2, 9),
          name: device.name || 'Неизвестное устройство',
          rssi: -50, // Mock RSSI value
          connected: device.gatt?.connected || false,
          services: []
        };

        this.devices.push(bleDevice);
      }
    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        this.error = 'Устройства не найдены';
      } else if (error.name === 'SecurityError') {
        this.error = 'Доступ к Bluetooth запрещен';
      } else {
        this.error = 'Ошибка сканирования: ' + error.message;
      }
    } finally {
      this.scanning = false;
    }
  }

  protected onDeviceClick(device: BleDevice): void {
    this.router.navigate(['/areas', this.area_pk, 'ble', 'device', device.id], {
      state: { device }
    });
  }

  protected getRssiClass(rssi: number): string {
    if (rssi > -50) return 'text-success';
    if (rssi > -70) return 'text-warning';
    return 'text-danger';
  }

  protected getRssiIcon(rssi: number): string {
    if (rssi > -50) return 'signal-strong';
    if (rssi > -70) return 'signal-medium';
    return 'signal-weak';
  }
}