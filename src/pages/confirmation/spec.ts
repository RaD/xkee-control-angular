import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationPage } from './component';

describe('ConfirmationComponent', () => {
  let component: ConfirmationPage;
  let fixture: ComponentFixture<ConfirmationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
