import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpAstroComponent } from './kp-astro.component';

describe('KpAstroComponent', () => {
  let component: KpAstroComponent;
  let fixture: ComponentFixture<KpAstroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpAstroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpAstroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
