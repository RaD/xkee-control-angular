import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceListPage } from './component';

describe('DevicesComponent', () => {
  let component: DeviceListPage;
  let fixture: ComponentFixture<DeviceListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
