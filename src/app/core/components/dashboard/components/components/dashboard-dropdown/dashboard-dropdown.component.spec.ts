import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDropdownComponent } from './dashboard-dropdown.component';

describe('DashboardDropdownComponent', () => {
  let component: DashboardDropdownComponent;
  let fixture: ComponentFixture<DashboardDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
