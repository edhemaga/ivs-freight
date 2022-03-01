import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardStateUsaComponent} from './dashboard-state-usa.component';

describe('DashboardStateUsaComponent', () => {
  let component: DashboardStateUsaComponent;
  let fixture: ComponentFixture<DashboardStateUsaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardStateUsaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardStateUsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
