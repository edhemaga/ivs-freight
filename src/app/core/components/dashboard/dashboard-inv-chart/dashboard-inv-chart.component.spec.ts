import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardInvChartComponent} from './dashboard-inv-chart.component';

describe('DashboardInvChartComponent', () => {
  let component: DashboardInvChartComponent;
  let fixture: ComponentFixture<DashboardInvChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardInvChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardInvChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
