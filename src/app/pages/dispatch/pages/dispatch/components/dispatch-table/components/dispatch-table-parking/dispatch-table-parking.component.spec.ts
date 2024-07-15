import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTableParkingComponent } from './dispatch-table-parking.component';

describe('DispatchTableParkingComponent', () => {
  let component: DispatchTableParkingComponent;
  let fixture: ComponentFixture<DispatchTableParkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchTableParkingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchTableParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
