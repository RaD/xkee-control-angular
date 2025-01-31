import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
export class PaymentComponent implements OnInit{
  @Input() area_pk?: string;
  @Input() customer_pk?: string;

  faCalendar = faCalendarDays;

  protected fields: Payment;
  protected today = inject(NgbCalendar).getToday();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    let started_in: NgbDateStruct = this.today;
    let expired_in: NgbDateStruct = this.today;
    expired_in.year += 1;
    this.fields = new Payment(0, started_in, expired_in);
  }

  ngOnInit(): void {
  }

  public onSubmit(): void {
    // возвращаемся на список
    this.router.navigate(['/areas', this.area_pk, 'customers']);
  }
}
