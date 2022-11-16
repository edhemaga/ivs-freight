import { TestBed } from '@angular/core/testing';

import { CalendarScrollService } from './calendar-scroll.service';

describe('CalendarScrollService', () => {
   let service: CalendarScrollService;

   beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(CalendarScrollService);
   });

   it('should be created', () => {
      expect(service).toBeTruthy();
   });
});
