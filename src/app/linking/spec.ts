import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkingComponent } from './component';

describe('LinkingComponent', () => {
  let component: LinkingComponent;
  let fixture: ComponentFixture<LinkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
