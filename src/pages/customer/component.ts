import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';

import { StorageService } from '../../services/storage';
import { Area } from '../area/interface';
import { Customer } from './interface';
import { SmartButtonComponent } from '../../components/smart-button/component';
import { PageTransitionService } from '../../services/transitions';
import { Utilities } from '../../services/phone-utils';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    DatePipe,
    SmartButtonComponent
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class CustomerPage implements OnInit {
  private pageTransition = inject(PageTransitionService);
  private location = inject(Location);

  faSave = faSave;
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;

  protected fields: Customer;
  protected area: Area | null = null;
  protected customer: Customer | null = null;
  protected action: string | null = null;

  constructor(
    private localStore: StorageService,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    this.fields = new Customer('', false, '', '');
    const pk = this.route.snapshot.paramMap.get('pk');
    const customer_pk = this.route.snapshot.paramMap.get('customer_pk');
    this.action = this.route.snapshot.paramMap.get('action');
    if (pk) {
      this.area = this.localStore.getArea(pk);
    }
    if (customer_pk) {
      this.customer = this.localStore.getCustomer(customer_pk);
    }
  }

  ngOnInit(): void {
    if (this.area?.pk != null && this.customer?.pk && this.action != null) {
      if (this.action === 'delete') {
        this.localStore.removeCustomer(this.customer.pk, this.area.pk);
        // возвращаемся на список
        this.router.navigate(['/areas', this.area.pk, 'customers']);
      } else {
        let o: Customer = this.customer;
        this.fields = new Customer(
          o.pk, o.active, o.last_name, o.first_name, o.middle_name,
          o.address, o.vehicle, o.comment, o.payments, o.synced, o.mm3hash);
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
      let f: Customer = this.fields;

      // Normalize phone number
      let normalizedPhone = Utilities.normalizePhone(f.pk);

      // Calculate hash
      let mm3hash = Utilities.computeHash(normalizedPhone);

      let customer: Customer = new Customer(
        normalizedPhone, f.active, f.last_name, f.first_name, f.middle_name,
        f.address, f.vehicle, f.comment, f.payments, f.synced, mm3hash);
      this.localStore.setCustomer(normalizedPhone, area_pk, customer);
    }
    // возвращаемся на список
    this.router.navigate(['/areas', area_pk, 'customers']);
  }

  protected navigateBack(): void {
    this.pageTransition.navigateBack(() => {
      this.location.back();
    });
  }

  protected navigateToRemove(): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate([
        '/confirm', 'areas', this.area?.pk,
        'customer', this.customer?.pk || this.fields.pk
      ]);
    });
  }
}
