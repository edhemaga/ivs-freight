import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperForgotPasswordComponent } from './helper-forgot-password.component';

describe('HelperForgotPasswordComponent', () => {
   let component: HelperForgotPasswordComponent;
   let fixture: ComponentFixture<HelperForgotPasswordComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [HelperForgotPasswordComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(HelperForgotPasswordComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
