import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faArrowLeft, faTrash, faFileImport, faFileExport, faSync } from '@fortawesome/free-solid-svg-icons';
import { faBluetooth } from '@fortawesome/free-brands-svg-icons';

import { Area } from './interface';
import { StorageService } from '../../services/storage';
import { SyncService, SyncResponse } from '../../services/sync';
import { SmartButtonComponent } from '../../components/smart-button/component';
import { PageTransitionService } from '../../services/transitions';
import { Utilities } from '../../services/phone-utils';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    SmartButtonComponent,
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class AreaPage implements OnInit {
  private pageTransition = inject(PageTransitionService);
  private location = inject(Location);
  private syncService = inject(SyncService);
  private localStore = inject(StorageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  faSave = faSave;
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;
  faFileImport = faFileImport;
  faFileExport = faFileExport;
  faSync = faSync;
  faBluetooth = faBluetooth;

  protected fields: Area = new Area(this.generateUUID(), '', '', '', [], [], {});
  protected pk: string | null = this.route.snapshot.paramMap.get('pk');
  protected action: string | null = this.route.snapshot.paramMap.get('action');
  protected syncing: boolean = false;

  /**
   * Generate UUID with fallback for browsers that don't support crypto.randomUUID()
   */
  private generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback UUID generation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  ngOnInit(): void {
    if (this.pk != null && this.action != null) {
      let area = this.localStore.getArea(this.pk);
      if (area != null) {
        if (this.action === 'delete') {
          this.localStore.removeArea(this.pk);
          // возвращаемся на список
          this.pageTransition.navigateBack(() => {
            this.router.navigate(['/areas']);
          });
        } else {
          this.fields = new Area(
            area.pk, area.title, area.address, area.kind,
            area.devices, area.customers, area.linked, area.access, area.secret);

          // Normalize all customers' phone numbers and update mm3hash
          this.normalizeCustomers(area.pk);
        }
      }
    }
  }

  private normalizeCustomers(areaPk: string): void {
    const customers = this.localStore.getCustomerList(areaPk);
    let updated = false;

    customers.forEach(customer => {
      const normalizedPhone = Utilities.normalizePhone(customer.pk);
      const newHash = Utilities.computeHash(normalizedPhone);

      // Check if phone or hash needs updating
      if (customer.pk !== normalizedPhone || !customer.mm3hash || customer.mm3hash !== newHash) {
        // If phone changed, remove old customer entry
        if (customer.pk !== normalizedPhone) {
          this.localStore.removeCustomer(customer.pk, areaPk);
        }

        // Update customer with normalized phone and hash
        customer.pk = normalizedPhone;
        customer.mm3hash = newHash;

        // Save updated customer
        this.localStore.setCustomer(normalizedPhone, areaPk, customer);
        updated = true;
      }
    });

    if (updated) {
      // Reload area to get updated customer list
      const updatedArea = this.localStore.getArea(areaPk);
      if (updatedArea) {
        this.fields = new Area(
          updatedArea.pk, updatedArea.title, updatedArea.address, updatedArea.kind,
          updatedArea.devices, updatedArea.customers, updatedArea.linked,
          updatedArea.access, updatedArea.secret);
      }
    }
  }

  protected need_credentials(): boolean {
    return this.fields.kind == 'xkee';
  }

  protected is_creation(): boolean {
    return this.pk == null;
  }

  /**
   * onSubmit
   * Обработка отправки формы
   */
  public onSubmit(): void {
    // создаём ключ для территории
    let pk: string = this.fields.pk;
    let area: Area = new Area(
      this.fields.pk,
      this.fields.title,
      this.fields.address,
      this.fields.kind,
      this.fields.devices,
      this.fields.customers,
      this.fields.linked,
      this.fields.access,
      this.fields.secret
    );
    this.localStore.setArea(pk, area);
    // возвращаемся на список
    this.pageTransition.navigateBack(() => {
      this.router.navigate(['/areas']);
    });
  }

  protected export(): void {
    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      let ts: string = new Date().toJSON();
      let content: any = this.localStore.export_area(pk);

      const dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(content);
      let a = document.createElement('a');
      a.href = dataStr;
      a.download = `xkee-area-${pk}-${ts}.json`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  /**
   * Sync customers with backend
   */
  protected onSync(): void {
    if (!this.fields || this.syncing) {
      return;
    }

    this.syncing = true;
    const customers = this.localStore.getCustomerList(this.fields.pk);

    this.syncService.syncCustomers(this.fields, customers).subscribe({
      next: (responses: SyncResponse[]) => {
        // Update customers with sync responses
        responses.forEach(response => {
          const customer = customers.find(c => c.pk === response.pk);
          if (customer) {
            customer.active = response.active;
            customer.synced = response.synced;
            // Save updated customer to localStorage
            this.localStore.setCustomer(customer.pk, this.fields.pk, customer);
          }
        });
        this.syncing = false;
        this.showNotification('Синхронизация завершена успешно', 'success');
      },
      error: (error) => {
        this.syncing = false;
        console.error('Sync failed:', error);
        this.showNotification(error.message || 'Не удалось синхронизировать данные. Попробуйте позже.', 'danger');
      }
    });
  }

  /**
   * Show notification message
   */
  protected showNotification(message: string, type: string = 'info'): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Add to body
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  protected navigateBack(): void {
    this.pageTransition.navigateBack(() => {
      this.location.back();
    });
  }

  protected navigateToImport(): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate(['/areas', 'import']);
    });
  }

  protected navigateToConfirm(): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate(['/confirm', 'areas', this.fields.pk]);
    });
  }

  protected navigateToBLE(): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate(['/areas', this.fields.pk, 'ble']);
    });
  }
}
