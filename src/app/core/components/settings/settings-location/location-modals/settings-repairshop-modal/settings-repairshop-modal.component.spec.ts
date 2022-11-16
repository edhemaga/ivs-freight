/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SettingsRepairshopModalComponent } from './settings-repairshop-modal.component';

describe('SettingsRepairshopModalComponent', () => {
   let component: SettingsRepairshopModalComponent;
   let fixture: ComponentFixture<SettingsRepairshopModalComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [SettingsRepairshopModalComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SettingsRepairshopModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
