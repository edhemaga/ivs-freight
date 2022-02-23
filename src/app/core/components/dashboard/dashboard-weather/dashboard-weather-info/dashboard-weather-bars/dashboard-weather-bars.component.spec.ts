import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardWeatherBarsComponent} from './dashboard-weather-bars.component';

describe('DashboardWeatherBarsComponent', () => {
  let component: DashboardWeatherBarsComponent;
  let fixture: ComponentFixture<DashboardWeatherBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardWeatherBarsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWeatherBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
