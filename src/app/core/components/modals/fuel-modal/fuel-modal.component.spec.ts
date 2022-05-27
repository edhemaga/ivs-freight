/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FuelModalComponent } from './fuel-modal.component';

describe('FuelModalComponent', () => {
  let component: FuelModalComponent;
  let fixture: ComponentFixture<FuelModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
