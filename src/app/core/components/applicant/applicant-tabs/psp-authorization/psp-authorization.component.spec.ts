import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PspAuthorizationComponent } from './psp-authorization.component';

describe('PspAuthorizationComponent', () => {
   let component: PspAuthorizationComponent;
   let fixture: ComponentFixture<PspAuthorizationComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [PspAuthorizationComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(PspAuthorizationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
