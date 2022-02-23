import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardWeatherComponent} from './dashboard-weather.component';

describe('DashboardWeatherComponent', () => {
  let component: DashboardWeatherComponent;
  let fixture: ComponentFixture<DashboardWeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardWeatherComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
