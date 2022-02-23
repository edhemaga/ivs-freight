import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardWeatherInfoComponent} from './dashboard-weather-info.component';

describe('DashboardWeatherInfoComponent', () => {
  let component: DashboardWeatherInfoComponent;
  let fixture: ComponentFixture<DashboardWeatherInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardWeatherInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWeatherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
