// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { CalendarRoutingModule } from './calendar-routing.module';

// Components
import { CalendarComponent } from './pages/calendar/calendar.component';
import { CalendarMonthComponent } from './pages/calendar/components/calendar-month/calendar-month.component';
import { TaCarrierSearchComponent } from 'src/app/shared/components/ta-carrier-search/ta-carrier-search.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from 'src/app/shared/components/ta-tab-switch/ta-tab-switch.component';

// FullCalendarModule.registerPlugins([dayGridPlugin, interactionPlugin]);

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
        TaCarrierSearchComponent,
        TaCustomCardComponent,
        TaTabSwitchComponent,
    ],
})
export class CalendarModule {}
