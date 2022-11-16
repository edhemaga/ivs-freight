import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatcherHistoryComponent } from './dispatcher-history.component';

describe('DispatcherHistoryComponent', () => {
   let component: DispatcherHistoryComponent;
   let fixture: ComponentFixture<DispatcherHistoryComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [DispatcherHistoryComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(DispatcherHistoryComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
