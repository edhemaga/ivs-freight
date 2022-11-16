import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDispatcherTableNewComponent } from './app-dispatcher-table-new.component';

describe('AppDispatcherTableNewComponent', () => {
   let component: AppDispatcherTableNewComponent;
   let fixture: ComponentFixture<AppDispatcherTableNewComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [AppDispatcherTableNewComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AppDispatcherTableNewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
