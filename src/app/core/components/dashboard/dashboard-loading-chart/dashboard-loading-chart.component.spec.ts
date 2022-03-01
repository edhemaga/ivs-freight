import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardLoadingChartComponent} from './dashboard-loading-chart.component';

describe('DashboardLoadingChartComponent', () => {
  let component: DashboardLoadingChartComponent;
  let fixture: ComponentFixture<DashboardLoadingChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardLoadingChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLoadingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
