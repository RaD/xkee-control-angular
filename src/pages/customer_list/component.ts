
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faFolderTree } from '@fortawesome/free-solid-svg-icons';
import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../../services/storage';
import { SyncService, SyncResponse } from '../../services/sync';
import { Area } from '../area/interface';
import { Customer } from '../customer/interface';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    RouterLink,
    HttpClientModule
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class CustomerListPage implements OnInit {
  // иконки
  faUser = faUser;
  faUserSlash = faUserSlash
  faSearch = faMagnifyingGlass;
  faLink = faLink;
  faChildren = faFolderTree;
  faPayment = faMoneyCheckDollar;
  faSync = faSync;
  faCheck = faCheck;
  faWarning = faExclamationTriangle;
  faArrowLeft = faArrowLeft;
  faPlus = faPlus;

  protected area_pk: string | null = null;
  protected area: Area | null = null;
  protected empty: boolean = true;
  protected customers: Customer[] = [];
  protected search_query: string;
  protected syncing: boolean = false;

  constructor(
    private localStore: StorageService,
    private syncService: SyncService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.search_query = '';
    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      this.area_pk = pk;
      this.area = this.localStore.getArea(pk);
    }
  }

  ngOnInit(): void {
    if (this.area_pk) {
      this.customers = this.localStore.getCustomerList(this.area_pk);
      this.empty = this.customers.length == 0;
    }
  }

  /**
   * onSubmit
   * Обработка поискового запроса
   */
  public onSearch(): void {
    let area_pk = this.area?.pk;
    if (area_pk) {
      this.customers = this.localStore.search_customers(area_pk, this.search_query);
    }
    // возвращаемся на список
    this.router.navigate(['/areas', area_pk, 'customers']);
  }

  /**
   *
   * @param customer_pk
   * @returns список прикреплённых клиентов
   */
  protected getLinkedFor(customer_pk: string): Customer[] {
    let result: Customer[] = [];
    if (this.area) {
      let linked_pks: string[] = this.area.linked[customer_pk];
      if (linked_pks) {
        linked_pks.forEach((key: string) => {
          let customer: Customer | null = this.localStore.getCustomer(key);
          if (customer) {
            result.push(customer);
          }
        });
      }
    }
    return result;
  }

  /**
   *
   * @param customer_pk
   * @returns строку с телефонами прикреплённых клиентов
   */
  protected getLinkedNamesFor(customer_pk: string): string {
    let result: string = '';
    let customers: Customer[] = this.getLinkedFor(customer_pk);
    customers.forEach(item => result += ` ${item.pk}`);
    return result;
  }

  /**
   * Sync customers with backend
   */
  public onSync(): void {
    if (!this.area || this.syncing) {
      return;
    }

    this.syncing = true;

    this.syncService.syncCustomers(this.area, this.customers).subscribe({
      next: (responses: SyncResponse[]) => {
        // Update customers with sync responses
        responses.forEach(response => {
          const customer = this.customers.find(c => c.pk === response.pk);
          if (customer) {
            customer.active = response.active;
            customer.synced = response.synced;
            // Save updated customer to localStorage
            if (this.area_pk) {
              this.localStore.setCustomer(customer.pk, this.area_pk, customer);
            }
          }
        });
        this.syncing = false;
        // Refresh customer list
        if (this.area_pk) {
          this.customers = this.localStore.getCustomerList(this.area_pk);
        }
      },
      error: (error) => {
        this.syncing = false;
        console.error('Sync failed:', error);
        this.showNotification(error.message || 'Не удалось синхронизировать данные. Попробуйте позже.');
      }
    });
  }

  /**
   * Check if customer is synced (within last 24 hours)
   */
  protected isSynced(customer: Customer): boolean {
    if (!customer.synced) {
      return false;
    }
    const syncDate = new Date(customer.synced);
    const now = new Date();
    const diffHours = (now.getTime() - syncDate.getTime()) / (1000 * 60 * 60);
    return diffHours < 24;
  }

  /**
   * Show notification message
   */
  private showNotification(message: string): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'alert alert-warning alert-dismissible fade show position-fixed';
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
