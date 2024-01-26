import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLink, faLinkSlash, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../storage.service';
import { Area } from '../area/interface';
import { Customer } from '../customer/interface';

@Component({
  selector: 'app-linking',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class LinkingComponent {
  faSearch = faMagnifyingGlass;
  faLink = faLink;
  faUnlink = faLinkSlash;

  @ViewChild('form_search', {static: false}) form_search: any;

  protected area_pk: string | null = null;
  protected area: Area | null = null;
  protected customer_pk: string | null = null;
  protected customer: Customer | null = null;
  protected customers_search: Customer[]= [];
  protected customers_linked: Customer[]= [];
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
    const customer_pk = this.route.snapshot.paramMap.get('customer_pk');
    if (customer_pk) {
      this.customer_pk = customer_pk;
      this.customer = this.localStore.getCustomer(customer_pk);
      this.updateLinked(customer_pk);
    }
  }

  private updateLinked(customer_pk: string): void {
    if (this.area) {
      let pklist: string[]= this.area.linked[customer_pk];
      this.customers_linked = [];
      pklist.forEach((key: string) => {
        let customer: Customer | null = this.localStore.getCustomer(key);
        if (customer) {
          this.customers_linked.push(customer);
        }
      });
    }
  }

  /**
   * onSubmit
   * Обработка поискового запроса
   */
  public onSearch(): void {
    let area_pk = this.area?.pk;
    if (area_pk) {
      let customers: Customer[] = this.localStore.search_customers(area_pk, this.search_query);
      let area: Area | null = this.localStore.getArea(area_pk);
      // получаем список телефонов, уже связанных с пользователем
      let linked_pk: string[] = [];
      this.customers_linked.forEach((item: Customer) => {
        linked_pk.push(item.pk);
      });
      // убираем из результатов поиска главного клиента и тех, кто уже с ним связан
      if (area) {
        customers.forEach((item: Customer) => {
          if (linked_pk.indexOf(item.pk) == -1 && item.pk != this.customer_pk) {
            this.customers_search.push(item);
          }
        })
      }
    }
  }

  /**
   * onLink
   */
  public onLink(pk: string):  void {
    let child: Customer | null = this.localStore.getCustomer(pk);
    if (child && this.area_pk && this.customer_pk) {
      this.localStore.linkCustomer(this.area_pk, this.customer_pk, pk);
      this.customers_linked.push(child);
      this.customers_search = [];
    }
  }

  /**
   * onUnlink
   */
  public onUnlink(pk: string):  void {
    let child: Customer | null = this.localStore.getCustomer(pk);
    if (child && this.area && this.customer) {
      this.localStore.unlinkCustomer(this.area, this.customer, pk);
      this.updateLinked(this.customer.pk);
      this.customers_search = [];
    }
  }
}
