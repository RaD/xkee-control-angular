import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Payment } from './interface';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    FontAwesomeModule,
    NgbDatepickerModule,
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class PaymentPage implements OnInit{
  @Input() area_pk?: string;
  @Input() customer_pk?: string;

  faCalendar = faCalendarDays;

  protected fields: Payment;
  protected started_in = inject(NgbCalendar).getToday();
  protected expired_in = new NgbDate(
    this.started_in.year + 1,
    this.started_in.month,
    this.started_in.day
  );
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const registered_in = Date.now();
    this.fields = new Payment(0, this.started_in, this.expired_in, registered_in);
  }

  ngOnInit(): void {
  }

  public onSubmit(): void {
    // возвращаемся на список
    this.router.navigate(['/areas', this.area_pk, 'customers']);
  }
}
