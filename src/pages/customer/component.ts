import { Component, OnInit } from '@angular/core';

import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage';
import { Area } from '../area/interface';
import { Customer } from './interface';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class CustomerPage implements OnInit {
  protected fields: Customer;
  protected area: Area | null = null;
  protected customer: Customer | null = null;
  protected action: string | null = null;

  constructor(
    private localStore: StorageService,
    private router: Router,
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
        this.localStore.removeDevice(this.customer.pk, this.area.pk);
        // возвращаемся на список
        this.router.navigate(['/areas', this.area.pk, 'devices']);
      } else {
        let o: Customer = this.customer;
        this.fields = new Customer(
          o.pk, o.active, o.last_name, o.first_name, o.middle_name,
          o.address, o.vehicle, o.comment, o.payments);
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
      let phone: string = this.fields.pk;
      let f: Customer = this.fields;
      let customer: Customer = new Customer(
        f.pk, f.active, f.last_name, f.first_name, f.middle_name,
        f.address, f.vehicle, f.comment, f.payments);
      this.localStore.setCustomer(phone, area_pk, customer);
    }
    // возвращаемся на список
    this.router.navigate(['/areas', area_pk, 'customers']);
  }
}
