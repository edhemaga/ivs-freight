import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardWeatherMapComponent} from './dashboard-weather-map.component';

describe('DashboardWeatherMapComponent', () => {
  let component: DashboardWeatherMapComponent;
  let fixture: ComponentFixture<DashboardWeatherMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardWeatherMapComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWeatherMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
