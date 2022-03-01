import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardHistoryComponent} from './dashboard-history.component';

describe('DashboardHistoryComponent', () => {
  let component: DashboardHistoryComponent;
  let fixture: ComponentFixture<DashboardHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardHistoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
