/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RepairShopModalComponent } from './repair-shop-modal.component';

describe('RepairShopModalComponent', () => {
  let component: RepairShopModalComponent;
  let fixture: ComponentFixture<RepairShopModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RepairShopModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairShopModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
