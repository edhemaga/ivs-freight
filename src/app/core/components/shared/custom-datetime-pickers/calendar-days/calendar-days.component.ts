import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
   selector: 'app-calendar-days',
   templateUrl: './calendar-days.component.html',
   styleUrls: ['./calendar-days.component.scss'],
})
export class CalendarDaysComponent implements OnInit {
   currentYear: any = new Date().getFullYear();
   currentMonth: any = new Date().getMonth();
   currentDay: any = new Date().getDate();
   selectedMonthFromInput: any;
   selectedYearFromInput: any;
   @Input() dateTime: any;
   @Input() year: string;
   @Input() selectedMonth: string;
   @Input() index: number;
   @Output() selectDay = new EventEmitter();
   days: ReadonlyArray<string | number> = [];
   selectedDay: any = -1;
   selMonth: any = -1;
   selectedYear: any = -1;

   constructor() {}

   @Input()
   set month(month: Date) {
      this.selectedMonthFromInput = ('0' + month.getMonth() + 1).slice(-2);
      this.selectedYearFromInput = month.getFullYear();
      const fillerCount = month.getDay();
      const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      const daysCount = lastDay.getDate();

      this.days = [
         ...Array.from({ length: fillerCount }).map(() => ''),
         ...Array.from({ length: daysCount }).map((_, i) => i + 1),
      ];

      // console.log("WHAT ARE DAYS");
      // console.log(this.days);
   }

   ngOnInit(): void {
      this.selectedDay = ('0' + this.dateTime.getDate()).slice(-2);
      this.selMonth = ('0' + this.dateTime.getMonth() + 1).slice(-2);
      this.selectedYear = this.dateTime.getFullYear();
   }

   chooseDay(day): void {
      this.selectDay.emit({ index: this.index, day });
   }
}
