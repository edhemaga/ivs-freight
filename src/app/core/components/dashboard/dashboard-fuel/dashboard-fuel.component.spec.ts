import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardFuelComponent} from './dashboard-fuel.component';

describe('DashboardFuelComponent', () => {
  let component: DashboardFuelComponent;
  let fixture: ComponentFixture<DashboardFuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardFuelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
