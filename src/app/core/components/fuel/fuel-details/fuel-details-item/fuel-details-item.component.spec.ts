import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelDetailsItemComponent } from './fuel-details-item.component';

describe('FuelDetailsItemComponent', () => {
  let component: FuelDetailsItemComponent;
  let fixture: ComponentFixture<FuelDetailsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FuelDetailsItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelDetailsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
