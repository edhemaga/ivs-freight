import { SharedModule } from './../shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToDoRoutingModule } from './to-do-routing.module';
import { ToDoListCardComponent } from './to-do-list-card/to-do-list-card.component';

import { GridsterModule } from 'angular-gridster2';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { CarrierSearchComponent } from '../standalone-components/carrier-search/carrier-search.component';
import { FilterComponent } from '../standalone-components/filter/filter.component';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { formatDatePipe } from '../../pipes/formatDate.pipe';

@NgModule({
    declarations: [ToDoListCardComponent],
    imports: [
        CommonModule,
        ToDoRoutingModule,
        AngularSvgIconModule,
        GridsterModule,
        SharedModule,
        NgxSmoothDnDModule,
        CarrierSearchComponent,
        FilterComponent,
        AppTooltipComponent,
        formatDatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ToDoModule {}
