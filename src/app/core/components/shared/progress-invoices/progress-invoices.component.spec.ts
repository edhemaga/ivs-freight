import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressInvoicesComponent } from './progress-invoices.component';

describe('ProgressInvoicesComponent', () => {
   let component: ProgressInvoicesComponent;
   let fixture: ComponentFixture<ProgressInvoicesComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [ProgressInvoicesComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(ProgressInvoicesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
