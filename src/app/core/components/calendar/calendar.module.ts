
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarMonthComponent } from './calendar-month/calendar-month.component';

import { TruckassistSearchModule } from '../shared/truckassist-search/truckassist-search.module';

FullCalendarModule.registerPlugins([dayGridPlugin, interactionPlugin]);

@NgModule({
    declarations: [CalendarComponent, CalendarMonthComponent],
    imports: [
        CommonModule,
        CalendarRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        FullCalendarModule,
        TruckassistSearchModule,
    ],
})
export class CalendarModule {}
