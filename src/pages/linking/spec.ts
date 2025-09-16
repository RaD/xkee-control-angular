import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkingPage } from './component';

describe('LinkingComponent', () => {
  let component: LinkingPage;
  let fixture: ComponentFixture<LinkingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkingPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
