/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SettingsPayrollComponent } from './settings-payroll.component';

describe('SettingsPayrollComponent', () => {
   let component: SettingsPayrollComponent;
   let fixture: ComponentFixture<SettingsPayrollComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [SettingsPayrollComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SettingsPayrollComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
