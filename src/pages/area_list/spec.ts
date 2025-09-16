import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaListPage } from './component';

describe('AreasComponent', () => {
  let component: AreaListPage;
  let fixture: ComponentFixture<AreaListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
