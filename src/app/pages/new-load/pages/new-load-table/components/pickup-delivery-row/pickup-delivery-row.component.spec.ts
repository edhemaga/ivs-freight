import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupDeliveryRowComponent } from './pickup-delivery-row.component';

describe('PickupDeliverRowComponent', () => {
  let component: PickupDeliveryRowComponent;
  let fixture: ComponentFixture<PickupDeliveryRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickupDeliveryRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickupDeliveryRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
