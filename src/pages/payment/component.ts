import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { faCalendarDays, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Payment } from './interface';
import { StorageService } from '../../services/storage';
import { Customer } from '../customer/interface';
import { PaymentHistoryComponent } from '../../components/payment_history/component';
import { SmartButtonComponent } from '../../components/smart-button/component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    FontAwesomeModule,
    NgbDatepickerModule,
    PaymentHistoryComponent,
    SmartButtonComponent,
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class PaymentPage implements OnInit{
  @Input() area_pk?: string;
  @Input() customer_pk?: string;

  faCalendar = faCalendarDays;
  faSave = faSave;
  faArrowLeft = faArrowLeft;

  protected fields: Payment;
  protected started_in = inject(NgbCalendar).getToday();
  protected expired_in = new NgbDate(
    this.started_in.year + 1,
    this.started_in.month,
    this.started_in.day
  );
  constructor(
    private localStore: StorageService,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    const registered_in = Date.now();
    this.fields = new Payment(0, this.started_in, this.expired_in, registered_in);
  }

  ngOnInit(): void {
  }

  public onSubmit(): void {
    if (this.customer_pk) {
      // Get customer from storage
      let customer: Customer | null = this.localStore.getCustomer(this.customer_pk);
      if (customer) {
        // Initialize payments array if it doesn't exist
        if (!customer.payments) {
          customer.payments = [];
        }
        
        // Add new payment to the beginning of the array
        customer.payments.unshift(this.fields);
        
        // Keep only the latest 5 payments
        if (customer.payments.length > 5) {
          customer.payments = customer.payments.slice(0, 5);
        }
        
        // Save updated customer back to storage
        if (this.area_pk) {
          this.localStore.setCustomer(this.customer_pk, this.area_pk, customer);
        }
      }
    }
    
    // возвращаемся на список
    this.router.navigate(['/areas', this.area_pk, 'customers']);
  }
}
