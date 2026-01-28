import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingAndPopularityComponent } from './rating-and-popularity.component';

describe('RatingAndPopularityComponent', () => {
  let component: RatingAndPopularityComponent;
  let fixture: ComponentFixture<RatingAndPopularityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingAndPopularityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RatingAndPopularityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
