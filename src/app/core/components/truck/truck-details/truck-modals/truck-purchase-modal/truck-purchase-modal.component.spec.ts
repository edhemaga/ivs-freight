import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckPurchaseModalComponent } from './truck-purchase-modal.component';

describe('TruckPurchaseModalComponent', () => {
  let component: TruckPurchaseModalComponent;
  let fixture: ComponentFixture<TruckPurchaseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckPurchaseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckPurchaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
