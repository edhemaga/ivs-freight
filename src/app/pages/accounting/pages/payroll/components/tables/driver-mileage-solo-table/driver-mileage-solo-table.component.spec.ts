import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMileageSoloTableComponent } from './driver-mileage-solo-table.component';

describe('DriverMileageSoloTableComponent', () => {
  let component: DriverMileageSoloTableComponent;
  let fixture: ComponentFixture<DriverMileageSoloTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverMileageSoloTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverMileageSoloTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
