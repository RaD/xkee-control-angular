import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePage } from './component';

describe('DeviceComponent', () => {
  let component: DevicePage;
  let fixture: ComponentFixture<DevicePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevicePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
