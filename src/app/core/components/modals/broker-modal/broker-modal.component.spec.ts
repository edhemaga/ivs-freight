/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BrokerModalComponent } from './broker-modal.component';

describe('BrokerModalComponent', () => {
   let component: BrokerModalComponent;
   let fixture: ComponentFixture<BrokerModalComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BrokerModalComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BrokerModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
