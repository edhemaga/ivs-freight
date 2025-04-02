import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';

// modules
import { SharedModule } from '@shared/shared.module';
import { CalendarRoutingModule } from '@pages/calendar/calendar-routing.module';

// components
import { CalendarComponent } from '@pages/calendar/pages/calendar/calendar.component';
import { CalendarMonthComponent } from '@pages/calendar/pages/calendar/components/calendar-month/calendar-month.component';
import { TaSearchComponent } from '@shared/components/ta-search/ta-search.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import {
    CaSearchMultipleStatesComponent,
    CaTabSwitchComponent,
} from 'ca-components';

@NgModule({
    declarations: [CalendarComponent, CalendarMonthComponent],
    imports: [
        // Modules
        CommonModule,
        CalendarRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        FullCalendarModule,

        // Components
        TaSearchComponent,
        TaCustomCardComponent,
        CaTabSwitchComponent,
        CaSearchMultipleStatesComponent,
    ],
})
export class CalendarModule {}
