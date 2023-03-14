import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivchartsComponent } from './divcharts.component';

describe('DivchartsComponent', () => {
  let component: DivchartsComponent;
  let fixture: ComponentFixture<DivchartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivchartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
