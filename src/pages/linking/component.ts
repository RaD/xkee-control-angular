import { Component, inject, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLink, faLinkSlash, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

import { StorageService } from '../../services/storage';
import { PageTitleService } from '../../services/page-title';
import { Area } from '../area/interface';
import { Customer } from '../customer/interface';
import { SmartButtonComponent } from '../../components/smart-button/component';
import { PageTransitionService } from '../../services/transitions';

@Component({
  selector: 'app-linking',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    SmartButtonComponent
  ],
  templateUrl: './template.html',
  styleUrl: './styles.less'
})
export class LinkingPage {
  private pageTransition = inject(PageTransitionService);
  private location = inject(Location);
  private localStore = inject(StorageService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);
  private pageTitleService = inject(PageTitleService);

  faSearch = faMagnifyingGlass;
  faLink = faLink;
  faUnlink = faLinkSlash;
  faArrowLeft = faArrowLeft;
  faPlus = faPlus;

  @ViewChild('form_search', {static: false}) form_search: any;

  protected area_pk: string | null = null;
  protected area: Area | null = null;
  protected customer_pk: string | null = null;
  protected customer: Customer | null = null;
  protected customers_search: Customer[]= [];
  protected customers_linked: Customer[]= [];
  protected search_query: string;
  protected found: string[] = []; // PK из customers_search

  constructor() {
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

  /**
   * updateLinked
   * Получает список привязанных клиентов из хранилища и обновляет
   * их локальный список.
   * @param customer_pk - идентификатор клиента, привязки которого следует обновить
   */
  private updateLinked(customer_pk: string): void {
    if (this.area) {
      this.customers_linked = [];
      let pklist: string[] = this.area.linked[customer_pk];
      if (!pklist) {
        pklist = [];
      }
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
          if (linked_pk.indexOf(item.pk) == -1
              && this.found.indexOf(item.pk) == -1
              && item.pk != this.customer_pk) {
            this.customers_search.push(item);
            this.found.push(item.pk);
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
    if (child && this.area && this.customer) {
      this.localStore.changeLinking(this.area, this.customer, pk, false);
      this.customers_linked.push(child);
      this.customers_search = [];
      this.found = [];
    }
  }

  /**
   * onUnlink
   */
  public onUnlink(pk: string):  void {
    let child: Customer | null = this.localStore.getCustomer(pk);
    if (child && this.area && this.customer) {
      this.localStore.changeLinking(this.area, this.customer, pk, true);
      this.updateLinked(this.customer.pk);
      this.customers_search = [];
      this.found = [];
    }
  }

  protected navigateBack(): void {
    this.pageTransition.navigateBack(() => {
      this.location.back();
    });
  }

  protected navigateToCreate(): void {
    this.pageTransition.navigateForward(() => {
      this.router.navigate(['/areas', this.area?.pk, 'customers', 'create']);
    });
  }
}
