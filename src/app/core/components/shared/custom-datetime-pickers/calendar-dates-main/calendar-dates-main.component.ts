import {CalendarScrollService} from './../calendar-scroll.service';
import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY} from "@angular/cdk/scrolling";
import {FULL_SIZE, MobileCalendarStrategy} from "./../date-calendars/calendar_strategy";
import moment from "moment";

const SCROLL_DEBOUNCE_TIME = 80;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

@Component({
  selector: 'app-calendar-dates-main',
  templateUrl: './calendar-dates-main.component.html',
  styleUrls: ['./calendar-dates-main.component.scss'],
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useClass: MobileCalendarStrategy
    }
  ]
})
export class CalendarDatesMainComponent implements OnInit {
  @Input() months: any;
  @Input() currentIndex: any;
  @Input() monthYearsIndx: any;
  @Input() listPreview: any; 
  @Output() setListPreviewToFull: EventEmitter<any> = new EventEmitter();

  @ViewChild("monthsScrollRef", {static: true})
  public virtualScrollViewport: CdkVirtualScrollViewport;

  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  selectedYear: any;
  selectedMonth: any;
  private activeMonth = 0;

  constructor(private calendarService: CalendarScrollService) {
  }

  ngOnInit(): void {

    this.calendarService.scrollToAutoIndex.subscribe(indx => {
      this.virtualScrollViewport.scrollToIndex(indx, "auto");
    });

    this.calendarService.scrolledIndexChange.subscribe(res => {
      if (res.type != "main" && this.calendarService.selectedScroll != 'main') {
        const sizeTimes = FULL_SIZE / res.cycleSize;
        const newScrollSize = Math.ceil(sizeTimes * res.scrollOffset);
        this.virtualScrollViewport.scrollToOffset(newScrollSize);
      }
    });

    this.calendarService.scrollToDate.subscribe(res => {
      setTimeout(() => {
        if (res) {
          const indx = this.findIndexInMonth(res);
          this.virtualScrollViewport.scrollToIndex(indx);
        } else {
          this.virtualScrollViewport.scrollToIndex(this.currentIndex);
        }
        
      });
    });
  }

  findIndexInMonth(date: string): number {
    const selectedDate = new Date(date);
    const indexMonth = (selectedDate.getFullYear() - 1905) * 12;
    const indx = indexMonth + selectedDate.getMonth();
    return indx;
  }

  onMonthChange(data: any) {
    this.selectedYear = this.months[data.indx].getFullYear();
    this.selectedMonth = this.monthNames[this.months[data.indx].getMonth()];
    this.activeMonth = data.indx;
    this.calendarService.index$.next(data);
  }

  getMonth(index: number): string {
    return MONTHS[index];
  }

  mouseOverSetItem(){
    this.calendarService.scrolledScrollItem = 'main';
  }

  setCalendarListPreview(num){
    this.setListPreviewToFull.emit(num);
  }


  public selectDay(data): void {
    const selectedMonth = this.months[data.index];
    const new_date = moment(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), data.day)).format("MM/DD/YY");
    this.calendarService.dateChanged.next(new_date.split("/"));
  }

}
