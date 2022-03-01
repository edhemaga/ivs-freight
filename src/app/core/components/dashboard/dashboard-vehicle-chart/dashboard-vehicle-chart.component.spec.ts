import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardVehicleChartComponent} from './dashboard-vehicle-chart.component';

describe('DashboardVehicleChartComponent', () => {
  let component: DashboardVehicleChartComponent;
  let fixture: ComponentFixture<DashboardVehicleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardVehicleChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardVehicleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
