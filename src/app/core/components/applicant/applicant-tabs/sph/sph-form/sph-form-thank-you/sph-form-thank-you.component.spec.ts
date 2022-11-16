import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SphFormThankYouComponent } from './sph-form-thank-you.component';

describe('SphFormThankYouComponent', () => {
  let component: SphFormThankYouComponent;
  let fixture: ComponentFixture<SphFormThankYouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SphFormThankYouComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SphFormThankYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
