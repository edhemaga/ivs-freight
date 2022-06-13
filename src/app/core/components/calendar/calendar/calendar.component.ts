import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Calendar } from '@fullcalendar/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

import { start } from 'repl';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  @ViewChild('fullcalendar', {static: false}) fullcalendar: FullCalendarComponent;
  public inputDate: FormControl = new FormControl(true);

  calendarYears: any[] = [
    {
      year: 2017
    },
    {
      year: 2018
    },
    {
      year: 2019
    },
    {
      year: 2020
    },
    {
      year: 2021
    },
    {
      year: 2022,
      active: true
    },
    {
      year: 2023
    },
    {
      year: 2024
    },
    {
      year: 2025
    },
    {
      year: 2026
    },
    {
      year: 2027
    },
    {
      year: 2028
    },
    {
      year: 2029
    },
    {
      year: 2030
    }
  ];

  currentCalendarView = 'month';

  event_colors: any = {
    'important': this.currentCalendarView == 'week' ? '#BA68C8' : '#BA68C8B3',
    'company': this.currentCalendarView == 'week' ? '#6D82C7' : '#6D82C7B3',
    'personal': this.currentCalendarView == 'week' ? '#FFB74D' : '#FFB74DB3',
    'moreEvents': this.currentCalendarView == 'week' ? '#AAAAAA' : '#AAAAAAB3',
    'holiday': this.currentCalendarView == 'week' ? '#4DB6A2' : '#4DB6A2B3'
  };

  currentEvents: any = [
    {
      title: 'event 1 very long name check',
      color: this.event_colors['important'],
      start: '2022-06-07',
      end: '2022-06-08',
      textColor: '#fff'
    },
    { 
      title: 'event 2',
      color: this.event_colors['company'],
      start: '2022-06-06',
      end: '2022-06-13',
      textColor: '#fff'
    },
    { 
      title: 'Event 3',
      color: this.event_colors['personal'],
      start: '2022-06-18',
      end: '2022-06-26',
      textColor: '#000',
      display: 'list-item'
    },
    { 
      title: 'Personal Event',
      color: this.event_colors['personal'],
      start: '2022-06-06T00:30:00',
      end: '2022-06-06T23:30:00',
      textColor: '#fff'
    }
  ];

  headerBarInfo: Object = {
      weekday: 'long'
  }

  calendarTitle: String = '';
  calendarGridView: String = 'dayGridMonth';

  calendarOptions: CalendarOptions;

  constructor() {
    const name = Calendar.name
   }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.checkCalendarTitle();
    this.setCalendarOptions(this.currentEvents, this.calendarGridView, this.headerBarInfo);
  }

  setCalendarOptions(ev, type, headerInfo) {
    console.log(ev, type, headerInfo, 'setcalendaroptions');
    this.calendarOptions = {
      plugins: [ dayGridPlugin, timeGridPlugin ], 
      initialView: type,
      dayHeaderFormat: headerInfo,
      headerToolbar: {
        left: '',
        center: '',
        right: ''
      },
      events: ev,
      editable: true,
      eventResizableFromStart: true,
      slotLabelInterval: '00:30',
      allDayText: 'All Day',
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: 'short'
      },
      views: {
        day: {
            titleFormat: {
                year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
            },
        },
     },
     eventResize: this.resizeEvent.bind(this),
    };
    this.changeViewCalendar(type);
  }

  public changeMonth(mod) {
    const calendar = this.fullcalendar.getApi();
    if ( mod == 'next' ) { calendar.next(); }
    else { calendar.prev(); }

    console.log(calendar, 'allcalendarinfo');

    this.checkCalendarTitle();
  }

  public checkCalendarTitle() {
    const calendarApi = this.fullcalendar.getApi();
    console.log(calendarApi.currentData, 'viewitle');
    this.calendarTitle = this.calendarGridView == 'timeGridWeek' ? calendarApi.currentData.viewTitle.split(",")[0] : this.calendarTitle = calendarApi.currentData.viewTitle.split(" ")[0];
  }

  resizeEvent(mod) {
    console.log(mod, 'resized');
  }

  changeCalendarView(view) {
    if ( this.currentCalendarView == view ) { return false; }

    this.currentCalendarView = view;
    var gridType = view == 'month' ? 'dayGridMonth' : view == 'week' ? 'timeGridWeek' : 'dayGridMonth';
    this.calendarGridView = gridType;
    var headerInfo = view == 'week' ? {
      weekday: 'long',
      month: 'numeric',
      day: 'numeric', omitCommas: true 
    }
    :
    {
      weekday: 'long'
    };

    this.headerBarInfo = headerInfo;
    console.log(this.calendarGridView, this.headerBarInfo)
    this.setCalendarOptions(this.currentEvents, this.calendarGridView, this.headerBarInfo);
  }

  public changeViewCalendar(view: any) {
    // const checkedView = view.find((item: any) => item.checked);
    // const calendarApi = this.fullcalendar.getApi();
    // if (checkedView.name == 'Week' || checkedView.name == 'Day') {
    //   calendarApi.setOption('selectMinDistance', 25);
    // } else {
    //   calendarApi.setOption('selectMinDistance', 150);
    // }
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.changeView(view);
    this.calendarTitle = this.calendarGridView == 'timeGridWeek' ? calendarApi.currentData.viewTitle.split(",")[0] : this.calendarTitle = calendarApi.currentData.viewTitle.split(" ")[0];
  }

}
