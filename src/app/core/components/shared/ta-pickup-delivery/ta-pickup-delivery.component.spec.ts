import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaPickupDeliveryComponent } from './ta-pickup-delivery.component';

describe('TaPickupDeliveryComponent', () => {
  let component: TaPickupDeliveryComponent;
  let fixture: ComponentFixture<TaPickupDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaPickupDeliveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaPickupDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
