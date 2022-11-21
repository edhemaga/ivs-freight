/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TtFhwaInspectionModalComponent } from './tt-fhwa-inspection-modal.component';

describe('TtFhwaInspectionModalComponent', () => {
  let component: TtFhwaInspectionModalComponent;
  let fixture: ComponentFixture<TtFhwaInspectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TtFhwaInspectionModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtFhwaInspectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
