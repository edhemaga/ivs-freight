/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaFileComponent } from './ta-file.component';

describe('TaFileComponent', () => {
  let component: TaFileComponent;
  let fixture: ComponentFixture<TaFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
