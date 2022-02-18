import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardPerformanceChartComponent} from './dashboard-performance-chart.component';

describe('DashboardPerformanceChartComponent', () => {
  let component: DashboardPerformanceChartComponent;
  let fixture: ComponentFixture<DashboardPerformanceChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPerformanceChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPerformanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
