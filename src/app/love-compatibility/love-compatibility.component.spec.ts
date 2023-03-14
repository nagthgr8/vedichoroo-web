import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoveCompatibilityComponent } from './love-compatibility.component';

describe('LoveCompatibilityComponent', () => {
  let component: LoveCompatibilityComponent;
  let fixture: ComponentFixture<LoveCompatibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoveCompatibilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoveCompatibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
