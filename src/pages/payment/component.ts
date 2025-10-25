import { Component, OnInit, Input, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarDays, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { Payment } from './interface';
import { StorageService } from '../../services/storage';
import { Customer } from '../customer/interface';
import { PaymentHistoryComponent } from '../../components/payment_history/component';
import { SmartButtonComponent } from '../../components/smart-button/component';
import { PageTransitionService } from '../../services/transitions';
import { Utilities } from '../../services/phone-utils';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
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
  private pageTransition = inject(PageTransitionService);
  private location = inject(Location);
  private localStore = inject(StorageService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() area_pk?: string;
  @Input() customer_pk?: string;
  @ViewChild(PaymentHistoryComponent) paymentHistory?: PaymentHistoryComponent;

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
  constructor() {
    const registered_in = Date.now();
    this.fields = new Payment(0, this.started_in, this.expired_in, registered_in);
  }

  ngOnInit(): void {
  }

  public async onSubmit(): Promise<void> {
    // Validate amount
    if (!this.fields.amount || this.fields.amount <= 0) {
      return;
    }

    if (this.customer_pk && this.area_pk) {
      // Get customer from storage
      let customer: Customer | null = this.localStore.getCustomer(this.customer_pk);
      if (customer) {
        // Initialize payments array if it doesn't exist
        if (!customer.payments) {
          customer.payments = [];
        }

        // Calculate hash for new payment
        const newHash = Utilities.computePaymentHash(
          this.fields.amount,
          this.fields.started_in,
          this.fields.expired_in
        );

        // Check for duplicate
        const isDuplicate = customer.payments.some(p => p.mm3hash === newHash);
        if (isDuplicate) {
          // Payment already exists, don't add
          alert('Такой платёж уже существует');
          return;
        }

        // Set hash on new payment
        this.fields.mm3hash = newHash;

        // Add new payment to the beginning of the array
        customer.payments.unshift(this.fields);

        // Keep only the latest 5 payments
        if (customer.payments.length > 5) {
          customer.payments = customer.payments.slice(0, 5);
        }

        // Save updated customer back to storage
        this.localStore.setCustomer(this.customer_pk, this.area_pk, customer);

        // Wait a bit to ensure storage operation completes
        await new Promise(resolve => setTimeout(resolve, 100));

        // Reset form fields for new payment
        const registered_in = Date.now();
        const calendar = inject(NgbCalendar);
        this.started_in = calendar.getToday();
        this.expired_in = new NgbDate(
          this.started_in.year + 1,
          this.started_in.month,
          this.started_in.day
        );
        this.fields = new Payment(0, this.started_in, this.expired_in, registered_in);

        // Refresh payment history after a short delay
        if (this.paymentHistory) {
          setTimeout(() => {
            this.paymentHistory?.refresh();
          }, 150);
        }
      }
    }
  }

  protected navigateBack(): void {
    this.pageTransition.navigateBack(() => {
      this.router.navigate(['/areas', this.area_pk, 'customers']);
    });
  }
}
