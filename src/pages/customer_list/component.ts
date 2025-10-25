import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faFolderTree } from '@fortawesome/free-solid-svg-icons';
import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

import { StorageService } from '../../services/storage';
import { Area } from '../area/interface';
import { Customer } from '../customer/interface';
import { SmartButtonComponent } from '../../components/smart-button/component';
import { PageTransitionService } from '../../services/transitions';
import { Utilities } from '../../services/phone-utils';
import { PageTitleService } from '../../services/page-title';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    SmartButtonComponent
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class CustomerListPage implements OnInit {
  private pageTransition = inject(PageTransitionService);
  private location = inject(Location);
  private localStore = inject(StorageService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);
  private pageTitleService = inject(PageTitleService);

    // иконки
  faUser = faUser;
  faUserSlash = faUserSlash
  faSearch = faMagnifyingGlass;
  faLink = faLink;
  faChildren = faFolderTree;
  faPayment = faMoneyCheckDollar;
  faArrowLeft = faArrowLeft;
  faPlus = faPlus;

  protected area_pk: string | null = null;
  protected area: Area | null = null;
  protected empty: boolean = true;
  protected customers: Customer[] = [];
  protected search_query: string;

  constructor() {
    this.search_query = '';
    const pk = this.route.snapshot.paramMap.get('pk');
    if (pk) {
      this.area_pk = pk;
      this.area = this.localStore.getArea(pk);
    }
  }

  ngOnInit(): void {
    this.pageTitleService.setTitle(this.area?.title ? `Клиенты "${this.area.title}"` : 'Клиенты');
    if (this.area_pk) {
      this.customers = this.localStore.getCustomerList(this.area_pk);
      this.empty = this.customers.length == 0;

      // Check and update mm3hash for all customers
      this.validateCustomerHashes();
    }
  }

  /**
   * Validate and update mm3hash for all customers
   */
  private validateCustomerHashes(): void {
    if (!this.area_pk) return;

    const areaPk = this.area_pk;
    let anyUpdated = false;

    this.customers.forEach(customer => {
      let customerUpdated = false;

      // Normalize phone number
      const normalizedPhone = Utilities.normalizePhone(customer.pk);

      // Calculate expected hash
      const expectedHash = Utilities.computeHash(normalizedPhone);

      // Check if hash is missing, empty, or incorrect
      if (!customer.mm3hash || customer.mm3hash !== expectedHash) {
        // Update customer with correct hash
        customer.mm3hash = expectedHash;

        // If phone was normalized differently, update that too
        if (customer.pk !== normalizedPhone) {
          // Remove old entry
          this.localStore.removeCustomer(customer.pk, areaPk);
          customer.pk = normalizedPhone;
        }

        customerUpdated = true;
      }

      // Normalize payments
      if (customer.payments && customer.payments.length > 0) {
        const normalizedPayments = this.normalizePayments(customer.payments);
        if (normalizedPayments !== customer.payments) {
          customer.payments = normalizedPayments;
          customerUpdated = true;
        }
      }

      // Save updated customer if needed
      if (customerUpdated) {
        this.localStore.setCustomer(customer.pk, areaPk, customer);
        anyUpdated = true;
      }
    });

    // Reload customer list if any updates were made
    if (anyUpdated) {
      this.customers = this.localStore.getCustomerList(areaPk);
    }
  }

  /**
   * Normalize payments: add mm3hash and remove duplicates
   */
  private normalizePayments(payments: any[]): any[] {
    const seen = new Set<string>();
    const normalized: any[] = [];

    payments.forEach(payment => {
      // Calculate hash if missing
      if (!payment.mm3hash) {
        payment.mm3hash = Utilities.computePaymentHash(
          payment.amount,
          payment.started_in,
          payment.expired_in
        );
      }

      // Add only if not a duplicate
      if (!seen.has(payment.mm3hash)) {
        seen.add(payment.mm3hash);
        normalized.push(payment);
      }
    });

    return normalized;
  }

  /**
   * onSearch
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
   * getLinkedNamesFor
   * Получение имен связанных клиентов
   */
  protected getLinkedNamesFor(customer_pk: string): string {
    if (!this.area?.linked || !this.area.linked[customer_pk]) {
      return '';
    }

    const linkedPks = this.area.linked[customer_pk];
    const linkedNames = linkedPks
      .map(pk => this.localStore.getCustomer(pk))
      .filter(customer => customer !== null)
      .map(customer => `${customer!.last_name} ${customer!.first_name}`.trim());

    return linkedNames.join(', ');
  }

  protected navigateBack(): void {
    this.pageTransition.navigateBack(() => {
      this.router.navigate([
        '/areas', this.area_pk
      ]);
    });
  }

  protected navigateToCreate(): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate([
        '/areas', this.area?.pk, 'customers', 'create'
      ]);
    });
  }

  protected navigateToCustomer(customer_pk: string): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate([
        '/areas', this.area?.pk, 'customer', customer_pk, 'edit'
      ]);
    });
  }

  protected navigateToLinking(customer_pk: string): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate([
        '/areas', this.area?.pk, 'customer', customer_pk, 'linking'
      ]);
    });
  }

  protected navigateToPayment(customer_pk: string): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate([
        '/areas', this.area?.pk, 'customer', customer_pk, 'payment'
      ]);
    });
  }
}
