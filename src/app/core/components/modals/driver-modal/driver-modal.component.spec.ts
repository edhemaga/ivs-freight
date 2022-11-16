/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DriverModalComponent } from './driver-modal.component';

describe('DriverModalComponent', () => {
  let component: DriverModalComponent;
  let fixture: ComponentFixture<DriverModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DriverModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
