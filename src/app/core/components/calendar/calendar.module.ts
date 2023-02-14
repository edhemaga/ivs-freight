import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarMonthComponent } from './calendar-month/calendar-month.component';
import { CarrierSearchComponent } from '../standalone-components/carrier-search/carrier-search.component';
import { TaCustomCardComponent } from '../shared/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from '../standalone-components/ta-tab-switch/ta-tab-switch.component';

// FullCalendarModule.registerPlugins([dayGridPlugin, interactionPlugin]);

@NgModule({
    declarations: [CalendarComponent, CalendarMonthComponent],
    imports: [
        CommonModule,
        CalendarRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        FullCalendarModule,
        CarrierSearchComponent,
        TaCustomCardComponent,
        TaTabSwitchComponent
    ],
})
export class CalendarModule {}
