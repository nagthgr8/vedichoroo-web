import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitPredictionsComponent } from './transit-predictions.component';

describe('TransitPredictionsComponent', () => {
  let component: TransitPredictionsComponent;
  let fixture: ComponentFixture<TransitPredictionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransitPredictionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitPredictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
