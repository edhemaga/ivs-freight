import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverOwnerCollapsedTableComponent } from './driver-owner-collapsed-table.component';

describe('DriverOwnerCollapsedTableComponent', () => {
  let component: DriverOwnerCollapsedTableComponent;
  let fixture: ComponentFixture<DriverOwnerCollapsedTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverOwnerCollapsedTableComponent]
    });
    fixture = TestBed.createComponent(DriverOwnerCollapsedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
