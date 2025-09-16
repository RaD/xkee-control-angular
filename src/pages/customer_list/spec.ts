import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerListPage } from './component';

describe('CustomersComponent', () => {
  let component: CustomerListPage;
  let fixture: ComponentFixture<CustomerListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
