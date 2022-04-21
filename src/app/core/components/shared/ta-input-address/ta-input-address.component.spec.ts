/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaInputAddressComponent } from './ta-input-address.component';

describe('TaInputAddressComponent', () => {
  let component: TaInputAddressComponent;
  let fixture: ComponentFixture<TaInputAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaInputAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaInputAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
