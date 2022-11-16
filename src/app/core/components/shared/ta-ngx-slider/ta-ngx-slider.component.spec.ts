/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaNgxSliderComponent } from './ta-ngx-slider.component';

describe('TaNgxSliderComponent', () => {
  let component: TaNgxSliderComponent;
  let fixture: ComponentFixture<TaNgxSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaNgxSliderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaNgxSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
