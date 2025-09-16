
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    RouterLink,
    HttpClientModule,
    SmartButtonComponent
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class CustomerListPage implements OnInit {
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

  constructor(
    private localStore: StorageService,
    public router: Router,
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
}