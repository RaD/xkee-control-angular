import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BleListPage } from './component';

describe('BleListPage', () => {
  let component: BleListPage;
  let fixture: ComponentFixture<BleListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BleListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BleListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});