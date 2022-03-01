import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Calendar, createPlugin, sliceEvents} from '@fullcalendar/core';
import {environment} from 'src/environments/environment';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import {DatePipe} from '@angular/common';
import moment from 'moment';
import {Subject} from 'rxjs';
import { SchedulerService } from 'src/app/core/services/shared/scheduler.service';

@Component({
  selector: 'app-dashboard-calendar-custom',
  templateUrl: './dashboard-calendar-custom.component.html',
  styleUrls: ['./dashboard-calendar-custom.component.scss'],
  providers: [DatePipe]
})
export class DashboardCalendarCustomComponent implements OnInit, OnDestroy {
  events: any;
  public selectedDate = null;
  fullcalendar: any;
  public calendarTitle = '';
  format: any = environment.dateFormat;
  monthDays: any[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(public datepipe: DatePipe, private schedulerService: SchedulerService) {
  }

  ngOnInit(): void {
    this.renderCalendarDays(new Date());
    this.getAllEvents();
  }

  renderCalendarDays(dates) {
    const monthArray = [];
    // Previous month
    const prevMonth = new Date(dates.getFullYear(), dates.getMonth(), 0);
    // This month
    const thisMonth = new Date(dates.getFullYear(), dates.getMonth() + 1, 0);
    // Next month
    const nextMonth = new Date(dates.getFullYear(), dates.getMonth() + 1, 1);

    // Last day of previous month
    const lastMonthDay = prevMonth.getDate();
    // Previos month last day name / 0 - 6 // 0 is Sunday
    const lastMonthDayName = prevMonth.getDay();

    const lastMonthDiff = lastMonthDay - lastMonthDayName;

    const thisMonthDays = thisMonth.getDate();
    const nextMonthDays = nextMonth.getDay();

    this.monthDays = [];

    if (lastMonthDayName !== 6) {
      for (let i = lastMonthDiff; i <= lastMonthDay; i++) {
        this.monthDays.push(
          {
            day: i,
            additionalClass: ['prev_days'],
            events: []
          }
        );
      }
    }

    for (let i = 1; i <= thisMonthDays; i++) {
      const currentMonthDays = new Date(dates.getFullYear(), dates.getMonth(), i);
      const weekDay = currentMonthDays.getDay() === 0 || currentMonthDays.getDay() === 6 ? ['week_day'] : [];
      if ((currentMonthDays.getDate() === new Date().getDate()) && (dates.getMonth() === new Date().getMonth())) {
        weekDay.push('today_day');
      }
      this.monthDays.push(
        {
          day: i,
          additionalClass: weekDay,
          events: []
        }
      );
    }

    if (nextMonthDays !== 0) {
      for (let i = 1; i <= (7 - nextMonthDays); i++) {
        this.monthDays.push(
          {
            day: i,
            additionalClass: ['prev_days'],
            events: []
          }
        );
      }
    }
  }


  public handleCalendarArrowsClick(direction: string) {
    if (direction === 'prev') {
      this.fullcalendar.prev();
    } else {
      // this.fullcalendar.next();
      this.fullcalendar.gotoDate(moment(new Date(this.fullcalendar.currentData.viewTitle.replace(' ', ','))).add(1, 'M').format('YYYY-MM'));
    }
    this.checkCalendarTitle();
  }


  public checkCalendarTitle() {
    this.calendarTitle = this.fullcalendar.currentData.viewTitle.replace(' ', ', ');
  }

  public getAllEvents(): void {
    this.schedulerService.getEvents('scheduler')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any[]) => {
        this.events = [];
        console.log('CALENDAR EVEEEEEENTTTTTTTTTTTTTTTTTTTT');
        console.log(event);

        event.forEach((element) => {
          if (element.doc.rrule) {
            const rulleString = element.doc.rrule + (!!element.doc.exception ? element.doc.exception : '');
            this.events.push({
              id: element.id,
              groupId: element.id,
              title: element.title,
              rrule: rulleString
            });
          } else {
            this.events.push({
              id: element.id,
              description: element.description,
              title: element.title,
              start: new Date(element.startDate),
              end: new Date(element.endDate),
              allDay: element.isAllDay === 1,
              groupId: !!element.doc.groupIdForOccurence
                ? element.doc.groupIdForOccurence
                : !!element.doc.rrule
                  ? element.id
                  : '',
              // duration: element.isAllDay == 1
              //     ? ''
              //     : this.generateDuration(element.startDate, element.endDate).toString(),
            });
          }
        });

        this.renderCalendar(this.events);
      });
  }

  renderDateEvents(events: any) {
    // monthDays
    events.map(evnt => {
      const eventDays = this.getDaysBetweenDates(evnt.range.start, evnt.range.end);
      this.monthDays.map((day, indx) => {
        if (eventDays.includes(day.day.toString())
          && !this.monthDays[indx].additionalClass.includes('prev_days')) {
          if (!this.monthDays[indx].additionalClass.includes('with-event')) {
            this.monthDays[indx].additionalClass.push('with-event');
          }

          this.monthDays[indx].events.push(evnt);
        }
      });
    });
  }

  toggleShowMoreEvents(indx: number, type: boolean) {
    this.monthDays[indx].showedMore = type;
  }

  getDaysBetweenDates(start: any, end: any) {
    let startDate = start.valueOf();
    const endDate = end.valueOf();
    const dateList = [];
    while (startDate <= endDate) {
      dateList.push(moment(startDate).format('D'));
      startDate += 86400000;
    }

    dateList.pop();
    return dateList;
  }

  showMainCalendar(segs) {
    this.renderCalendarDays(new Date(this.fullcalendar.currentData.viewTitle.replace(' ', ',')));
    this.renderDateEvents(segs);
  }

  renderCalendar(events: any) {
    const CustomViewConfig = {
      classNames: ['custom-view'],
      content: (props) => {
        const segs = sliceEvents(props, true);
        this.showMainCalendar(segs);
        const html = `<div></div>`;

        return {html};
      }
    };

    const CustomViewPlugin = createPlugin({
      views: {
        custom: CustomViewConfig
      }
    });

    const calendarEl = document.getElementById('custom-calendar');
    this.fullcalendar = new Calendar(calendarEl, {
      plugins: [CustomViewPlugin, dayGridPlugin, interactionPlugin, timeGridPlugin, rrulePlugin],
      initialView: 'custom',
      events,
      visibleRange(currentDate) {
        const startDate = moment(new Date(currentDate)).format('YYYY-MM');
        const endDate = moment(new Date(currentDate)).add(1, 'M').format('YYYY-MM');
        return {start: startDate, end: endDate};
      }
    });

    this.fullcalendar.render();
    this.checkCalendarTitle();
  }

  public goToDate() {
    this.fullcalendar.gotoDate(this.datepipe.transform(this.selectedDate, 'yyyy-MM-dd'));
    this.checkCalendarTitle();
  }

  public goToTodayDate() {
    this.fullcalendar.gotoDate(this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
    this.checkCalendarTitle();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
