import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAnalysisComponent } from './chart-analysis.component';

describe('ChartAnalysisComponent', () => {
  let component: ChartAnalysisComponent;
  let fixture: ComponentFixture<ChartAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
