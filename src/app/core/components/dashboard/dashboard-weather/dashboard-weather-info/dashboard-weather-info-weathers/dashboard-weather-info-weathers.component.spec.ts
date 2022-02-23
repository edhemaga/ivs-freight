import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardWeatherInfoWeathersComponent} from './dashboard-weather-info-weathers.component';

describe('DashboardWeatherInfoWeathersComponent', () => {
  let component: DashboardWeatherInfoWeathersComponent;
  let fixture: ComponentFixture<DashboardWeatherInfoWeathersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardWeatherInfoWeathersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWeatherInfoWeathersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
