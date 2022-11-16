/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SettingsInsurancePolicyModalComponent } from './settings-insurance-policy-modal.component';

describe('SettingsInsurancePolicyModalComponent', () => {
   let component: SettingsInsurancePolicyModalComponent;
   let fixture: ComponentFixture<SettingsInsurancePolicyModalComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [SettingsInsurancePolicyModalComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SettingsInsurancePolicyModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
