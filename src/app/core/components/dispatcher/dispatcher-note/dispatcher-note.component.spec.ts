import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatcherNoteComponent } from './dispatcher-note.component';

describe('DispatcherNoteComponent', () => {
   let component: DispatcherNoteComponent;
   let fixture: ComponentFixture<DispatcherNoteComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [DispatcherNoteComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(DispatcherNoteComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
