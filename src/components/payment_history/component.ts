import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPayment } from '../../pages/payment/interface';
import { Customer } from '../../pages/customer/interface';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class PaymentHistoryComponent implements OnInit {
  @Input() customer_pk?: string;
  
  protected customer: Customer | null = null;
  protected payments: IPayment[] = [];

  constructor(private localStore: StorageService) {}

  ngOnInit(): void {
    if (this.customer_pk) {
      this.customer = this.localStore.getCustomer(this.customer_pk);
      if (this.customer && this.customer.payments) {
        this.payments = this.customer.payments;
      }
    }
  }

  protected formatDate(dateStruct: any): string {
    if (!dateStruct) return '';
    return `${dateStruct.day.toString().padStart(2, '0')}.${dateStruct.month.toString().padStart(2, '0')}.${dateStruct.year}`;
  }

  protected formatAmount(amount: number): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  }
}