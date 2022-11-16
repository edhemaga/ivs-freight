import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateCalendarsComponent } from './date-calendars.component';

describe('DateCalendarsComponent', () => {
   let component: DateCalendarsComponent;
   let fixture: ComponentFixture<DateCalendarsComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [DateCalendarsComponent],
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(DateCalendarsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
