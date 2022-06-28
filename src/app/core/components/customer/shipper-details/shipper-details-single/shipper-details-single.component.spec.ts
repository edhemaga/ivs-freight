import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperDetailsSingleComponent } from './shipper-details-single.component';

describe('ShipperDetailsSingleComponent', () => {
  let component: ShipperDetailsSingleComponent;
  let fixture: ComponentFixture<ShipperDetailsSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipperDetailsSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipperDetailsSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
