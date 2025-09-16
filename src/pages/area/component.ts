import { Component, OnInit } from '@angular/core';

import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faArrowLeft, faTrash, faFileImport, faFileExport, faSync } from '@fortawesome/free-solid-svg-icons';
import { faBluetooth } from '@fortawesome/free-brands-svg-icons';
import { HttpClientModule } from '@angular/common/http';
import { Area } from './interface';
import { StorageService } from '../../services/storage';
import { SyncService, SyncResponse } from '../../services/sync';
import { Customer } from '../customer/interface';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class AreaPage implements OnInit {
  faSave = faSave;
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;
  faFileImport = faFileImport;
  faFileExport = faFileExport;
  faSync = faSync;
  faBluetooth = faBluetooth;

  protected fields: Area;
  protected pk: string | null;
  protected action: string | null;
  protected syncing: boolean = false;

  constructor(
    private localStore: StorageService,
    private syncService: SyncService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.fields = new Area(this.generateUUID(), '', '', '', [], [], {});
    this.pk = this.route.snapshot.paramMap.get('pk');
    this.action = this.route.snapshot.paramMap.get('action');
  }

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
          this.router.navigate(['/areas']);
        } else {
          this.fields = new Area(
            area.pk, area.title, area.address, area.kind,
            area.devices, area.customers, area.linked, area.access, area.secret);
        }
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
    this.router.navigate(['/areas']);
  }

  protected export(): void {
    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      let ts: string = new Date().toJSON();
      let content: any = this.localStore.export_area(pk);
      let a = document.createElement('a');
      let file = new Blob([content], {type: 'application/json'});
      a.href = URL.createObjectURL(file);
      a.download = `xkee-area-${pk}-${ts}.json`;
      a.click();
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
}
