import { CalendarScrollService } from './calendar-scroll.service';
import { DateCalendarsComponent } from './date-calendars/date-calendars.component';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import calendarJson from '../../../../../assets/calendarjson/calendar.json';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import moment from "moment";

@Component({
  selector: 'app-custom-datetime-pickers',
  templateUrl: './custom-datetime-pickers.component.html',
  styleUrls: ['./custom-datetime-pickers.component.scss'],
  providers: [NgbDropdownConfig],
})
export class CustomDatetimePickersComponent implements OnInit {
  @Input() dateTime: Date;
  @ViewChild('ref', { read: ViewContainerRef }) ref: ViewContainerRef;

  @Output() closePopover: EventEmitter<any> = new EventEmitter();

  selectedDateTime: any;
  calendarMainType: string;
  outputType: any;
  @ViewChild(DateCalendarsComponent)
  dateCalendar: DateCalendarsComponent;
  @ViewChild('pmAmScroll') pmAmScroll: ElementRef;
  @ViewChild('minutesScroll') minutesScroll: ElementRef;
  @ViewChild('hourScroll') hourScroll: ElementRef;
  calendarData: any = calendarJson;
  calendarYears: any[] = Object.keys(calendarJson);
  currentYear: any = new Date().getFullYear();
  currentMonth: any = new Date().getMonth();
  currentDay: any = new Date().getDate();
  listPreview: any = 'full_list';
  timeMinutes: any = new Array(60)
    .fill(0)
    .map((_, idx) => (idx < 10 ? '0' + idx : idx));
  monthArray: any = new Array(12).fill(0).map((_, indx) => indx + 1);
  monthDayList: any = new Array(31).fill(0).map((_, indx) => indx + 1);
  yearsList: any = new Array(100)
    .fill(0)
    .map((_, idx) => (idx < 10 ? '0' + idx : idx));
  scrollTimer: any;
  hoveredItem: string;
  isInputFocus: boolean;
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
  hourTimes: any[] = [
    12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11,
  ];
  scrollTypes: any = {
    pmAmScroll: 0,
    minutesScroll: 0,
    hourScroll: 8,
    monthScroll: 0,
    dayScroll: 0,
    yearScroll: 0,
  };
  selectedTime: string = '12:00 AM';
  timeOfDay: any[] = ['AM', 'PM'];
  range: any = { start: 0, end: 0, side: 0 };
  rangeTypes: any[] = [
    {
      start: 0,
      end: 2,
      side: 1,
    },
    {
      start: 3,
      end: 5,
      side: 2,
    },
    {
      start: 6,
      end: 8,
      side: 3,
    },
  ];
  focusedElementInput: any;
  previousRangeSide: boolean;
  @ViewChild(NgbDropdown)
  private dropdown: NgbDropdown;

  constructor(private calendarService: CalendarScrollService) {}

  @Input()
  set calendarType(calendarType: string) {
    this.calendarMainType = calendarType;
    if (calendarType == 'time') {
      this.outputType = ['hh', ':', 'mm', ' ', 'AM'];
    } else {
      this.outputType = ['MM', '/', 'DD', '/', 'YY'];
    }
  }

  @Input()
  set placeholder(placeholder: string) {
    this.selectedDateTime = placeholder;
  }

  ngOnInit(): void {
    this.calendarService.dateChanged.subscribe((date) => {
      if (this.calendarMainType == 'time') {
      } else {
        this.outputType[0] = date[0];
        this.outputType[2] = date[1];
        this.outputType[4] = date[2];
        this.selectedDateTime = this.createStringFromOutput();
      }
    });
  }

  ngAfterViewInit() {
    this.setTimeValue();
    this.changeOpened();
  }

  public setTimeValue(){
    const dateInputArray = moment(this.dateTime).format("H/m/A").split("/");
    console.log(dateInputArray);
    this.scrollTypes.hourScroll = dateInputArray[0];
    this.scrollTypes.minutesScroll = dateInputArray[1];
    this.scrollTypes.pmAmScroll = dateInputArray[2] == "AM" ? 0 : 1;
  }

  public setListPreview(value: string): void {
    this.listPreview = value;
  }

  public inputInFocus(): void {
    this.isInputFocus = true;
  }

  public inputBlur(): void {
    this.isInputFocus = false;
  }

  public changeOpened(): void {
    // this.isInputFocus = e;
    // if (e) {
    if (this.calendarMainType == 'time') {
      setTimeout(() => {
        this.hourScroll.nativeElement.scrollTop =
          this.scrollTypes.hourScroll * 22;
        this.minutesScroll.nativeElement.scrollTop =
          this.scrollTypes.minutesScroll * 22;
        this.pmAmScroll.nativeElement.scrollTop =
          this.scrollTypes.pmAmScroll * 22;
      }, 0);
    } else {
      const date =
        isNaN(this.outputType[0]) ||
        isNaN(this.outputType[2]) ||
        isNaN(this.outputType[4])
          ? null
          : `${this.outputType[0]}/${this.outputType[2]}/${this.outputType[4]}`;
      console.log('THIS IS CROLLLL');
      console.log(date);

      console.log(
        `${
          this.dateTime.getMonth() + 1
        }/${this.dateTime.getDate()}/${this.dateTime.getFullYear()}`
      );
      this.calendarService.scrollToDate.next(
        `${
          this.dateTime.getMonth() + 1
        }/${this.dateTime.getDate()}/${this.dateTime.getFullYear()}`
      );
    }
  }

  renderCalendarDays(fullYear, fullMonth) {
    const monthArray = [];
    // Previous month
    const prevMonth = new Date(fullYear, fullMonth, 0);
    // This month
    const thisMonth = new Date(fullYear, fullMonth + 1, 0);
    // Next month
    const nextMonth = new Date(fullYear, fullMonth + 1, 1);

    // Last day of previous month
    const lastMonthDay = prevMonth.getDate();
    // Previos month last day name / 0 - 6 // 0 is Sunday
    const lastMonthDayName = prevMonth.getDay();

    const lastMonthDiff = lastMonthDay - lastMonthDayName;

    const thisMonthDays = thisMonth.getDate();
    const nextMonthDays = nextMonth.getDay();

    const monthDays = [];

    if (lastMonthDayName != 6) {
      for (let i = lastMonthDiff; i <= lastMonthDay; i++) {
        monthDays.push({
          day: i,
          additionalClass: ['prev_days'],
          events: [],
        });
      }
    }

    for (let i = 1; i <= thisMonthDays; i++) {
      monthDays.push({
        day: i,
        events: [],
      });
    }

    if (nextMonthDays != 0) {
      for (let i = 1; i <= 7 - nextMonthDays; i++) {
        monthDays.push({
          day: i,
          additionalClass: ['prev_days'],
          events: [],
        });
      }
    }

    return monthDays;
  }

  onScroll(e, type, index: number = null): void {
    const scrolFromTop = Math.floor(e.target.scrollTop);
    const scrollIndex = index == null ? Math.floor(scrolFromTop / 22) : index;
    const scrollRemaining = scrolFromTop % 22;
    clearInterval(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      if (scrollRemaining < 11 && index == null) {
        e.target.scrollTop = scrollIndex * 22;
        this.scrollTypes[type] = scrollIndex;
      } else if (index != null) {
        e.target.parentNode.scrollTop = scrollIndex * 22;
        this.scrollTypes[type] = scrollIndex;
      } else {
        e.target.scrollTop = (scrollIndex + 1) * 22;
        this.scrollTypes[type] = scrollIndex + 1;
      }

      this.checkForScrolledType(type);
    }, 200);
  }

  public checkForScrolledType(type): void {
    if (type == 'hourScroll') {
      if (this.scrollTypes[type] >= 12) {
        this.pmAmScroll.nativeElement.scrollTop = 22;
        this.scrollTypes.pmAmScroll = 1;
      } else {
        this.pmAmScroll.nativeElement.scrollTop = 0;
        this.scrollTypes.pmAmScroll = 0;
      }
    }

    if (type == 'pmAmScroll') {
      if (this.scrollTypes[type] == 0) {
        if (this.scrollTypes.hourScroll >= 12) {
          this.hourScroll.nativeElement.scrollTop =
            (this.scrollTypes.hourScroll - 12) * 22;
          this.scrollTypes.hourScroll = Math.floor(
            this.scrollTypes.hourScroll - 12
          );
        }
      } else {
        if (this.scrollTypes.hourScroll < 12) {
          this.hourScroll.nativeElement.scrollTop =
            (this.scrollTypes.hourScroll + 12) * 22;
          this.scrollTypes.hourScroll = Math.floor(
            this.scrollTypes.hourScroll + 12
          );
        }
      }
    }

    this.selectedTime = `${this.hourTimes[this.scrollTypes.hourScroll]}:${
      this.timeMinutes[this.scrollTypes.minutesScroll]
    } ${this.timeOfDay[this.scrollTypes.pmAmScroll]}`;
  }

  updateRangeTypes() {
    const first_length = this.outputType[0].toString().length;
    const second_length = this.outputType[2].toString().length;
    const third_length = this.outputType[4].toString().length;

    this.rangeTypes[0] = {
      ...this.rangeTypes[0],
      end: first_length,
    };

    this.rangeTypes[1] = {
      ...this.rangeTypes[1],
      start: first_length + 1,
      end: first_length + second_length + 1,
    };

    this.rangeTypes[2] = {
      ...this.rangeTypes[2],
      start: first_length + second_length + 2,
      end: first_length + second_length + third_length + 2,
    };

    const selectedRange = this.rangeTypes.find(
      (item) => item.side == this.range.side
    );
    this.range = selectedRange;
    this.previousRangeSide = false;
  }

  selectAreaOnInput(e: any): void {
    const selectionStart = e.target.selectionStart;
    const findedRange = this.rangeTypes.reduce((prev, current) => {
      return Math.abs(current.start - selectionStart) <
        Math.abs(prev.start - selectionStart)
        ? current
        : prev;
    });

    if (findedRange) {
      this.range = findedRange;
      this.previousRangeSide = false;
      this.setInputSelection(e);
    }
  }

  setInputSelection(e?): void {
    let field;
    if (e) {
      field = e.target;
      this.focusedElementInput = e.target;
    } else {
      field = this.focusedElementInput;
    }

    if (field.createTextRange) {
      var selRange = field.createTextRange();
      selRange.collapse(true);
      selRange.moveStart('character', this.range.start);
      selRange.moveEnd('character', this.range.end);
      selRange.select();
      field.focus();
    } else if (field.setSelectionRange) {
      field.focus();
      field.setSelectionRange(this.range.start, this.range.end);
    } else if (typeof field.selectionStart != 'undefined') {
      field.selectionStart = this.range.start;
      field.selectionEnd = this.range.end;
      field.focus();
    }
  }

  isNumber(evt) {
    evt = evt ? evt : window.event;
    let charCode = evt.which ? evt.which : evt.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  changeSelection(e): void {
    // console.log(e.keyCode);
    if (
      e.keyCode == 37 ||
      e.keyCode == 38 ||
      e.keyCode == 39 ||
      e.keyCode == 40 ||
      e.keyCode == 8 ||
      e.keyCode == 46 ||
      (this.range.side == 3 && this.calendarMainType == 'time')
    ) {
      !e.noPrevent && e.preventDefault();
      if (e.keyCode == 37) {
        if (this.range.side != 1) {
          this.range = this.rangeTypes[this.range.side - 2];
          this.previousRangeSide = false;
          this.setInputSelection();
        }
      } else if (e.keyCode == 39) {
        if (this.range.side != 3) {
          this.range = this.rangeTypes[this.range.side];
          this.previousRangeSide = false;
          this.setInputSelection();
        }
      } else if (e.keyCode == 38) {
        this.setDateTimeModel('up');
      } else if (e.keyCode == 40) {
        this.setDateTimeModel('down');
      }
    } else if (!this.isNumber(e)) {
      e.preventDefault();
    } else {
      e.preventDefault();
      this.handleKeyboardInputs(e);
    }
  }

  handleKeyboardInputs(e: KeyboardEvent): void {
    const value = parseInt(e.key);
    if (this.calendarMainType == 'time') {
      if (this.range.side == 1) {
        if (value != 0) {
          const prevValue =
            isNaN(this.outputType[0]) || !this.previousRangeSide
              ? value
              : parseInt(this.outputType[0] + '' + value);
          this.setDateTimeModel('up', prevValue);
          this.previousRangeSide = true;
          if (parseInt(prevValue + '0') > this.hourTimes.length / 2) {
            this.changeSelection({ keyCode: 39, noPrevent: true });
          }
        }
      } else if (this.range.side == 2) {
        if (value != 0) {
          const prevValue =
            isNaN(this.outputType[2]) || !this.previousRangeSide
              ? value
              : parseInt(this.outputType[2] + '' + value);

          this.setDateTimeModel('up', prevValue);
          this.previousRangeSide = true;
          if (parseInt(prevValue + '0') > this.timeMinutes.length - 1) {
            this.changeSelection({ keyCode: 39, noPrevent: true });
          }
        }
      }
    } else {
      if (this.range.side == 1) {
        if (value != 0) {
          const prevValue =
            (isNaN(this.outputType[0]) || !this.previousRangeSide
              ? value
              : parseInt(this.outputType[0] + '' + value)) - 1;
          this.setDateTimeModel('up', prevValue);
          this.previousRangeSide = true;
          if (parseInt(prevValue + 1 + '0') > this.monthArray.length - 1) {
            this.changeSelection({ keyCode: 39, noPrevent: true });
          }
        }
      } else if (this.range.side == 2) {
        if (value != 0) {
          const prevValue =
            (isNaN(this.outputType[2]) || !this.previousRangeSide
              ? value
              : parseInt(this.outputType[2] + '' + value)) - 1;
          this.setDateTimeModel('up', prevValue);
          this.previousRangeSide = true;
          if (parseInt(prevValue + 1 + '0') > this.monthDayList.length - 1) {
            this.changeSelection({ keyCode: 39, noPrevent: true });
          }
        }
      } else if (this.range.side == 3) {
        const prevValue =
          isNaN(this.outputType[4]) || !this.previousRangeSide
            ? value
            : parseInt(this.outputType[4] + '' + value);
        this.setDateTimeModel('up', prevValue);
        this.previousRangeSide = true;
        if (parseInt(prevValue + '0') > this.yearsList.length - 1) {
          this.changeSelection({ keyCode: 39, noPrevent: true });
        }
      }
    }
  }

  setTime() {
    this.outputType[0] = this.hourTimes[this.scrollTypes.hourScroll];

    this.outputType[2] = this.timeMinutes[this.scrollTypes.minutesScroll];
    this.outputType[4] = this.timeOfDay[this.scrollTypes.pmAmScroll];

    this.selectedDateTime = this.createStringFromOutput();
  
    let currentDate=moment().format('MM/DD/YYYY');
    console.log(currentDate + " " + this.selectedDateTime);
    
    this.calendarService.dateChanged.next(new Date(currentDate + " " + this.selectedDateTime));
    //this.dropdown.close();

    this.closePopover.emit();
  }

  setDefaultTime(){
    let currentDate=moment().format('MM/DD/YYYY');
    this.calendarService.dateChanged.next(new Date(currentDate + " 08:00"));

    this.closePopover.emit();
  }

  closePopup() {
    this.closePopover.emit();
  }

  setDateTimeModel(direction: string, index?: any): void {
    if (this.calendarMainType == 'time') {
      if (this.range.side == 1) {
        if (direction == 'up') {
          this.scrollTypes['hourScroll'] = !index
            ? this.scrollTypes['hourScroll'] + 1
            : index;
          if (this.scrollTypes['hourScroll'] > this.hourTimes.length - 1)
            this.scrollTypes['hourScroll'] = 0;
        } else {
          this.scrollTypes['hourScroll'] = this.scrollTypes['hourScroll'] - 1;
          if (this.scrollTypes['hourScroll'] < 0)
            this.scrollTypes['hourScroll'] = this.hourTimes.length - 1;
        }

        this.checkForScrolledType('hourScroll');

        this.outputType[4] = this.timeOfDay[this.scrollTypes.pmAmScroll];
        this.outputType[0] = this.hourTimes[this.scrollTypes.hourScroll];
        this.selectedDateTime = this.createStringFromOutput();
      } else if (this.range.side == 2) {
        if (direction == 'up') {
          this.scrollTypes['minutesScroll'] = !index
            ? this.scrollTypes['minutesScroll'] + 1
            : index;
          if (this.scrollTypes['minutesScroll'] > this.timeMinutes.length - 1)
            this.scrollTypes['minutesScroll'] = 0;
        } else {
          this.scrollTypes['minutesScroll'] =
            this.scrollTypes['minutesScroll'] - 1;
          if (this.scrollTypes['minutesScroll'] < 0)
            this.scrollTypes['minutesScroll'] = this.timeMinutes.length - 1;
        }

        this.checkForScrolledType('minutesScroll');

        this.outputType[2] = this.timeMinutes[this.scrollTypes.minutesScroll];
        this.selectedDateTime = this.createStringFromOutput();
      } else if (this.range.side == 3) {
        if (direction == 'up') {
          this.scrollTypes['pmAmScroll'] = !index
            ? this.scrollTypes['pmAmScroll'] + 1
            : index;
          if (this.scrollTypes['pmAmScroll'] > this.timeOfDay.length - 1)
            this.scrollTypes['pmAmScroll'] = 0;
        } else {
          this.scrollTypes['pmAmScroll'] = this.scrollTypes['pmAmScroll'] - 1;
          if (this.scrollTypes['pmAmScroll'] < 0)
            this.scrollTypes['pmAmScroll'] = this.timeOfDay.length - 1;
        }

        this.checkForScrolledType('pmAmScroll');

        this.outputType[4] = this.timeOfDay[this.scrollTypes.pmAmScroll];
        if (this.outputType[0] != 'hh') {
          this.outputType[0] = this.hourTimes[this.scrollTypes.hourScroll];
        }
        this.selectedDateTime = this.createStringFromOutput();
      }
    } else {
      if (this.range.side == 1) {
        if (direction == 'up') {
          this.scrollTypes['monthScroll'] =
            typeof index == 'undefined'
              ? this.scrollTypes['monthScroll'] + 1
              : index;
          if (this.scrollTypes['monthScroll'] > this.monthArray.length - 1)
            this.scrollTypes['monthScroll'] = 0;
        } else {
          this.scrollTypes['monthScroll'] = this.scrollTypes['monthScroll'] - 1;
          if (this.scrollTypes['monthScroll'] < 0)
            this.scrollTypes['monthScroll'] = this.monthArray.length - 1;
        }

        this.checkForScrolledType('monthScroll');

        this.outputType[0] = this.monthArray[this.scrollTypes.monthScroll];
        this.selectedDateTime = this.createStringFromOutput();

        const selectedYear = '20' + this.yearsList[this.scrollTypes.yearScroll];
        this.updateDaysForMonth(selectedYear, this.scrollTypes.monthScroll);
      }

      if (this.range.side == 2) {
        // dayScroll: 0,
        // yearScroll: 0

        if (direction == 'up') {
          this.scrollTypes['dayScroll'] =
            typeof index == 'undefined'
              ? this.scrollTypes['dayScroll'] + 1
              : index;
          if (this.scrollTypes['dayScroll'] > this.monthDayList.length - 1)
            this.scrollTypes['dayScroll'] = 0;
        } else {
          this.scrollTypes['dayScroll'] = this.scrollTypes['dayScroll'] - 1;
          if (this.scrollTypes['dayScroll'] < 0)
            this.scrollTypes['dayScroll'] = this.monthDayList.length - 1;
        }

        this.checkForScrolledType('dayScroll');

        this.outputType[2] = this.monthDayList[this.scrollTypes.dayScroll];
        this.selectedDateTime = this.createStringFromOutput();
      }

      if (this.range.side == 3) {
        // dayScroll: 0,
        // yearScroll: 0

        if (direction == 'up') {
          this.scrollTypes['yearScroll'] =
            typeof index == 'undefined'
              ? this.scrollTypes['yearScroll'] + 1
              : index;

          if (this.scrollTypes['yearScroll'] > this.yearsList.length - 1)
            this.scrollTypes['yearScroll'] = 0;
        } else {
          this.scrollTypes['yearScroll'] = this.scrollTypes['yearScroll'] - 1;
          if (this.scrollTypes['yearScroll'] < 0)
            this.scrollTypes['yearScroll'] = this.yearsList.length - 1;
        }

        this.checkForScrolledType('yearScroll');

        this.outputType[4] = this.yearsList[this.scrollTypes.yearScroll];
        this.selectedDateTime = this.createStringFromOutput();
        const selectedYear = '20' + this.yearsList[this.scrollTypes.yearScroll];
        this.updateDaysForMonth(selectedYear, this.scrollTypes.monthScroll);
      }
    }

    this.updateRangeTypes();

    setTimeout(() => {
      this.setInputSelection();
    }, 5);
  }

  public createStringFromOutput(): string {
    return this.outputType.join('');
  }

  private updateDaysForMonth(year, month): void {
    const lastDay = new Date(year, month + 1, 0).getDate();
    this.monthDayList = new Array(lastDay).fill(0).map((_, indx) => indx + 1);

    if (this.scrollTypes.dayScroll > this.monthDayList.length - 1) {
      this.scrollTypes.dayScroll = this.monthDayList.length - 1;
      this.outputType[2] = this.monthDayList[this.scrollTypes.dayScroll];
      this.selectedDateTime = this.createStringFromOutput();
    }
  }

  ngOnDestroy(){
    this.listPreview = "full_list";
  }
}
