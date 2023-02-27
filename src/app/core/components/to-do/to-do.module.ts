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
import { TaUploadFilesComponent } from '../shared/ta-upload-files/ta-upload-files.component';
import { DetailsDropdownComponent } from '../shared/details-page-dropdown/details-dropdown';
import { TruckassistProgressExpirationComponent } from '../shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaUserReviewComponent } from '../shared/ta-user-review/ta-user-review.component';

@NgModule({
    declarations: [ToDoListCardComponent],
    imports: [
        //Modules
        CommonModule,
        ToDoRoutingModule,
        AngularSvgIconModule,
        GridsterModule,
        SharedModule,
        NgxSmoothDnDModule,

        //Components
        CarrierSearchComponent,
        FilterComponent,
        AppTooltipComponent,
        TaUploadFilesComponent,
        DetailsDropdownComponent,
        TruckassistProgressExpirationComponent,
        TaUserReviewComponent,

        //Pipes
        formatDatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ToDoModule {}
