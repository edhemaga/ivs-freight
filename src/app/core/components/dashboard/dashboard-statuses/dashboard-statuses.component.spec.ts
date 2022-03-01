import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardStatusesComponent} from './dashboard-statuses.component';

describe('DashboardStatusesComponent', () => {
  let component: DashboardStatusesComponent;
  let fixture: ComponentFixture<DashboardStatusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardStatusesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
