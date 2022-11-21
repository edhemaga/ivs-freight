/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelPurchaseModalComponent } from './fuel-purchase-modal.component';

describe('FuelPurchaseModalComponent', () => {
  let component: FuelPurchaseModalComponent;
  let fixture: ComponentFixture<FuelPurchaseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FuelPurchaseModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelPurchaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
