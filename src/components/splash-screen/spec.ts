import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SplashScreenComponent } from './component';

describe('SplashScreenComponent', () => {
  let component: SplashScreenComponent;
  let fixture: ComponentFixture<SplashScreenComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SplashScreenComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplashScreenComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show content after initialization', (done) => {
    setTimeout(() => {
      expect(component['showContent']).toBe(true);
      done();
    }, 150);
  });

  it('should navigate to areas on click', () => {
    component['onSplashClick']();
    expect(component['fadeOut']).toBe(true);
    
    setTimeout(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/areas']);
    }, 600);
  });
});