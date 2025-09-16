import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartButtonComponent } from './component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

describe('SmartButtonComponent', () => {
  let component: SmartButtonComponent;
  let fixture: ComponentFixture<SmartButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartButtonComponent, FontAwesomeModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartButtonComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    component.icon = faSave;
    component.text = 'Save';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display icon and text in normal mode', () => {
    component.kind = 'primary';
    component.text = 'Test Button';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('fa-icon')).toBeTruthy();
    expect(compiled.textContent).toContain('Test Button');
  });

  it('should apply correct Bootstrap classes', () => {
    component.kind = 'success';
    component.size = 'lg';
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button');
    expect(button?.classList).toContain('btn-success');
    expect(button?.classList).toContain('btn-lg');
  });

  it('should handle disabled state', () => {
    component.disabled = true;
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button');
    expect(button?.disabled).toBe(true);
  });
});