import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActivatedPageComponent } from './account-activated-page.component';

describe('AccountActivatedPageComponent', () => {
   let component: AccountActivatedPageComponent;
   let fixture: ComponentFixture<AccountActivatedPageComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [AccountActivatedPageComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountActivatedPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
