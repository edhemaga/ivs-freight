import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardCalendarCustomComponent} from './dashboard-calendar-custom.component';

describe('DashboardCalendarCustomComponent', () => {
  let component: DashboardCalendarCustomComponent;
  let fixture: ComponentFixture<DashboardCalendarCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardCalendarCustomComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCalendarCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
