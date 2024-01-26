import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../storage.service';
import { Area } from '../area/interface';
import { Customer } from '../customer/interface';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class CustomersComponent implements OnInit {
  // иконки
  faUser = faUser;
  faUserSlash = faUserSlash
  faSearch = faMagnifyingGlass;
  faLink = faLink;

  protected area_pk: string | null = null;
  protected area: Area | null = null;
  protected empty: boolean = true;
  protected customers: Customer[] = [];
  protected search_query: string;

  constructor(
    private localStore: StorageService,
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
}
