/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoadModalHazardousComponent } from './load-modal-hazardous.component';

describe('LoadModalHazardousComponent', () => {
  let component: LoadModalHazardousComponent;
  let fixture: ComponentFixture<LoadModalHazardousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadModalHazardousComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadModalHazardousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
