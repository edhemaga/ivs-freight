import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverOwnerTableComponent } from './driver-owner-table.component';

describe('DriverOwnerTableComponent', () => {
  let component: DriverOwnerTableComponent;
  let fixture: ComponentFixture<DriverOwnerTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverOwnerTableComponent]
    });
    fixture = TestBed.createComponent(DriverOwnerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
