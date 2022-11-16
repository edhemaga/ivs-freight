/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaCustomCardComponent } from './ta-custom-card.component';

describe('TaCustomCardComponent', () => {
  let component: TaCustomCardComponent;
  let fixture: ComponentFixture<TaCustomCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaCustomCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaCustomCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
