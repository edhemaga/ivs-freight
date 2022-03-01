import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardRoadInspectionComponent} from './dashboard-road-inspection.component';

describe('DashboardRoadInspectionComponent', () => {
  let component: DashboardRoadInspectionComponent;
  let fixture: ComponentFixture<DashboardRoadInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardRoadInspectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRoadInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
