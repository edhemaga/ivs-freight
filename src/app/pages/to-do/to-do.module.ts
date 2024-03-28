import { AngularSvgIconModule } from 'angular-svg-icon';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule } from 'angular-gridster2';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';

// moduels
import { ToDoRoutingModule } from './to-do-routing.module';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';

// components
import { DetailsDropdownComponent } from 'src/app/core/components/shared/details-page-dropdown/details-dropdown';
import { TaUploadFilesComponent } from 'src/app/core/components/shared/ta-upload-files/ta-upload-files.component';
import { TaUserReviewComponent } from 'src/app/core/components/shared/ta-user-review/ta-user-review.component';
import { TruckassistProgressExpirationComponent } from 'src/app/core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';
import { CarrierSearchComponent } from 'src/app/core/components/standalone-components/carrier-search/carrier-search.component';
import { FilterComponent } from 'src/app/core/components/standalone-components/filter/filter.component';
import { ToDoListCardComponent } from './to-do-list-card/to-do-list-card.component';

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
        formatDatePipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ToDoModule {}
