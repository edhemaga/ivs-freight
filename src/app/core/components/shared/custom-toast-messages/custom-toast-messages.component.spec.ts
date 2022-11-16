import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomToastMessagesComponent } from './custom-toast-messages.component';

describe('CustomToastMessagesComponent', () => {
   let component: CustomToastMessagesComponent;
   let fixture: ComponentFixture<CustomToastMessagesComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [CustomToastMessagesComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(CustomToastMessagesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
