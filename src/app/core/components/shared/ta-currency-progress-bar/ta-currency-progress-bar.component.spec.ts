/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaCurrencyProgressBarComponent } from './ta-currency-progress-bar.component';

describe('TaCurrencyProgressBarComponent', () => {
   let component: TaCurrencyProgressBarComponent;
   let fixture: ComponentFixture<TaCurrencyProgressBarComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [TaCurrencyProgressBarComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TaCurrencyProgressBarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
