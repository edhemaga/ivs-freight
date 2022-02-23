import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardWeatherCitiesComponent} from './dashboard-weather-cities.component';

describe('DashboardWeatherCitiesComponent', () => {
  let component: DashboardWeatherCitiesComponent;
  let fixture: ComponentFixture<DashboardWeatherCitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardWeatherCitiesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWeatherCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
