/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SettingsOfficeModalComponent } from './settings-office-modal.component';

describe('SettingsOfficeModalComponent', () => {
   let component: SettingsOfficeModalComponent;
   let fixture: ComponentFixture<SettingsOfficeModalComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [SettingsOfficeModalComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SettingsOfficeModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
