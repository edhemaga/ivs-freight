import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverOwnerExpandedTableComponent } from './driver-owner-expanded-table.component';

describe('DriverOwnerExpandedTableComponent', () => {
  let component: DriverOwnerExpandedTableComponent;
  let fixture: ComponentFixture<DriverOwnerExpandedTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverOwnerExpandedTableComponent]
    });
    fixture = TestBed.createComponent(DriverOwnerExpandedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
