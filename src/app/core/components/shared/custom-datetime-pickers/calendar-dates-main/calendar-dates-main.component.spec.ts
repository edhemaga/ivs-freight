import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDatesMainComponent } from './calendar-dates-main.component';

describe('CalendarDatesMainComponent', () => {
   let component: CalendarDatesMainComponent;
   let fixture: ComponentFixture<CalendarDatesMainComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [CalendarDatesMainComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CalendarDatesMainComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
