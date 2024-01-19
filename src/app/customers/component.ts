import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../storage.service';
import { Area } from '../area-form/interface';
import { Customer } from '../customer/interface';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class CustomersComponent implements OnInit {
  // иконки
  faGear = faGear;

  protected area_pk: string | null = null;
  protected area: Area | null = null;
  protected empty: boolean = true;
  protected customers: Customer[] = [];

  constructor(
    private localStore: StorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
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
}
