import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorelationComponent } from './correlation.component';

describe('CorelationComponent', () => {
  let component: CorelationComponent;
  let fixture: ComponentFixture<CorelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorelationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
