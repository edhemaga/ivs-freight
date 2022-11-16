/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaLogoChangeComponent } from './ta-logo-change.component';

describe('TaLogoChangeComponent', () => {
  let component: TaLogoChangeComponent;
  let fixture: ComponentFixture<TaLogoChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaLogoChangeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaLogoChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
