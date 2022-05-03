import {CalendarScrollService} from './../calendar-scroll.service';
import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import calendarJson from '../../../../../../assets/calendarjson/calendar.json';

import {RANGE, STARTING_YEAR} from "./calendar_strategy";
import {Subscription} from "rxjs";
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
  selector: 'app-date-calendars',
  templateUrl: './date-calendars.component.html',
  styleUrls: ['./date-calendars.component.scss']
})
export class DateCalendarsComponent implements OnInit {
  @Input() listPreview: string;
  @Input() dateTime: any;
  @Output() setListPreviewValue = new EventEmitter();

  currentYear: any = new Date().getFullYear();
  currentMonth: any = new Date().getMonth();
  currentDay: any = new Date().getDate();
  private activeIndex = 0;
  currentIndex: number;
  monthYearsIndx: any[] = [];
  months = Array.from(
    {length: RANGE},
    (_, i) => {
      let year = (STARTING_YEAR) + Math.floor(i / 12);
      let month = i % 12;
      if (year == this.currentYear && month == this.currentMonth) {
        this.currentIndex = i;
        this.activeIndex = i;
      }
      const sendDate = new Date(year, month, 1);
      this.monthYearsIndx.push(moment(sendDate).format("MM/DD/YY"));
      return sendDate;
    }
  );

  justYears = Array.from(
    {length: 196},
    (_, i) => {
      return new Date(STARTING_YEAR + i, 1, 1)
    });

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
  calendarData: any = calendarJson;
  calendarYears: any[] = Object.keys(calendarJson);
  selectedYear: any;

  // @ViewChild("monthsScrollRef", { static: true })
  // public virtualScrollViewport: CdkVirtualScrollViewport;

  // @ViewChild(CdkVirtualScrollViewport)
  // set monthsScrollRef(monthsScrollRef: CdkVirtualScrollViewport) {

  // }

  scrollTodayDate: boolean;
  selectedMonth: any;
  private activeMonth = 0;
  private subscription?: Subscription;

  constructor(private calendarService: CalendarScrollService) {
  }

  ngOnInit(): void {
    this.selectedMonth = this.monthNames[new Date().getMonth()]; 
    this.selectedYear = new Date().getFullYear();

    this.calendarService.scrolledIndexChange.subscribe(res => {
      this.activeIndex = res.indx;
      this.onMonthChange(res.indx);
    });
  }

  onMonthChange(month: number) {
    if( this.listPreview == 'full_list' ){
      this.selectedYear = this.months[month].getFullYear();
    }else{
      this.selectedYear = this.justYears[month].getFullYear();
    }
    
    this.selectedMonth = this.monthNames[this.months[month].getMonth()];
    this.activeMonth = month;
  }

  ngAfterViewChecked() {
    // console.log(this.virtualScrollViewport);
    // if( !this.scrollTodayDate ){
    //   this.scrollTodayDate = true;
    //   setTimeout(() =>{
    //     this.virtualScrollViewport.scrollToIndex(100);
    //   }, 200);
    // }
  }

  getMonth(index: number): string {
    return MONTHS[index];
  }

  public setListPreview(): void {

    if(this.listPreview === "full_list"){
      this.setListPreviewValue.emit("month_list");
      this.calendarService.indexAuto$.next(Math.floor(this.activeIndex / 12));
    }
  }

  public setListPreviewToFull(num){
    this.setListPreviewValue.emit("full_list");
    this.calendarService.indexAuto$.next(this.activeIndex * 12 + num);
  }

  public scrollToDate(): void {
    setTimeout(() => {
      //this.virtualScrollViewport.scrollToIndex(this.currentIndex);
    });

  }

  public scrollIndexChange(e): void {
    console.log(e);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
