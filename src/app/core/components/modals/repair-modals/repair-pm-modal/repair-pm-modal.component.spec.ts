/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RepairPmModalComponent } from './repair-pm-modal.component';

describe('RepairPmModalComponent', () => {
   let component: RepairPmModalComponent;
   let fixture: ComponentFixture<RepairPmModalComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [RepairPmModalComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RepairPmModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
