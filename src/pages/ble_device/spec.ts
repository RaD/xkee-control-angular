import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BleDevicePage } from './component';

describe('BleDevicePage', () => {
  let component: BleDevicePage;
  let fixture: ComponentFixture<BleDevicePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BleDevicePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BleDevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});