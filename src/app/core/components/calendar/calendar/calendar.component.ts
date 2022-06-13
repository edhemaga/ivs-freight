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
    'company': this.currentCalendarView == 'week' ? '#536BC2' : '#536BC2B3',
    'personal': this.currentCalendarView == 'week' ? '#FFB74D' : '#FFB74DB3',
    'moreEvents': this.currentCalendarView == 'week' ? '#AAAAAA' : '#AAAAAAB3',
    'holiday': this.currentCalendarView == 'week' ? '#4DB6A2' : '#4DB6A2B3'
  };

  currentEvents: any = [
    {
      title: 'event 1 very long name check',
      color: this.event_colors['important'],
      start: '2022-06-15',
      end: '2022-06-16',
      textColor: '#fff'
    },
    { 
      title: 'event 2',
      color: this.event_colors['company'],
      start: '2022-06-15',
      end: '2022-06-20',
      textColor: '#fff'
    },
    { 
      title: 'event 11',
      color: this.event_colors['company'],
      start: '2022-06-23',
      end: '2022-06-24',
      textColor: '#fff'
    },
    { 
      title: 'event 22',
      color: this.event_colors['company'],
      start: '2022-06-23',
      end: '2022-06-24',
      textColor: '#fff'
    },
    { 
      title: 'event 33',
      color: this.event_colors['company'],
      start: '2022-06-23',
      end: '2022-06-24',
      textColor: '#fff'
    },
    { 
      title: 'event 44',
      color: this.event_colors['company'],
      start: '2022-06-23',
      end: '2022-06-24',
      textColor: '#fff'
    },
    { 
      title: 'event 55',
      color: this.event_colors['company'],
      start: '2022-06-23',
      end: '2022-06-24',
      textColor: '#fff'
    },
    { 
      title: 'event 66',
      color: this.event_colors['company'],
      start: '2022-06-23',
      end: '2022-06-24',
      textColor: '#fff'
    },
    { 
      title: 'event 77',
      color: this.event_colors['company'],
      start: '2022-06-23',
      end: '2022-06-24',
      textColor: '#fff'
    },
    { 
      title: 'Event 3',
      color: this.event_colors['holiday'],
      start: '2022-06-18',
      end: '2022-06-20',
      textColor: '#fff'
    },
    { 
      title: 'Personal Event',
      color: this.event_colors['personal'],
      start: '2022-06-14T00:30:00',
      end: '2022-06-14T23:30:00',
      textColor: '#fff',
      description: 'Event description'
    },
    { 
      title: 'Today Holiday Event',
      color: this.event_colors['holiday'],
      start: '2022-06-13T02:30:00',
      end: '2022-06-13T16:30:00',
      textColor: '#fff',
      description: 'Event holiday description'
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
      eventDidMount: function(info) {
          var dotEl = <HTMLBodyElement> info.el.getElementsByClassName('fc-daygrid-event-dot')[0];
          if (dotEl) {
            dotEl.style.backgroundColor = info.backgroundColor;
          }
      },
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
        meridiem: 'short'
      },
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
        timeGrid: {
          dayMaxEventRows: 6
        },
      },
      moreLinkContent:function(args){
        return args.num+' More Events';
      },
      eventResize: this.resizeEvent.bind(this),
      dayMaxEventRows: true,
      eventMouseEnter: function (info) {
        console.log(info['event'], "-------hover--------");
      },
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
    if ( this.calendarGridView == 'timeGridWeek' ) {
      this.calendarTitle = calendarApi.currentData.viewTitle.split(",")[0];
    }
    else{
      var calendarTitleParts = calendarApi.currentData.viewTitle.split(" ");
      this.calendarTitle = calendarTitleParts[0]+', '+calendarTitleParts[1];
    }
  }

  resizeEvent(mod) {
    console.log(mod, 'resized');
  }

  hoverEvent(mod) {
    console.log(mod, 'hovered');
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
    console.log(calendarApi.currentData.viewTitle, 'calendarApi.currentData.viewTitle');
    if ( this.calendarGridView == 'timeGridWeek' ) {
      this.calendarTitle = calendarApi.currentData.viewTitle.split(",")[0];
    }
    else{
      var calendarTitleParts = calendarApi.currentData.viewTitle.split(" ");
      this.calendarTitle = calendarTitleParts[0]+', '+calendarTitleParts[1];
    }
    
    if ( this.calendarGridView == 'timeGridWeek' ) {
      var topLeftColumn = <HTMLElement> document.querySelector(".fc-timegrid-axis");
      topLeftColumn.innerHTML = '<div class="fc-scrollgrid-sync-inner"><a class="fc-col-header-cell-cushion">TIME</a></div>';
    }
  }

}