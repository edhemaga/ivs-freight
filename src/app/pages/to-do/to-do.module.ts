import { AngularSvgIconModule } from 'angular-svg-icon';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule } from 'angular-gridster2';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';

// moduels
import { ToDoRoutingModule } from './to-do-routing.module';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// pipes
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

// components
import { TaDetailsDropdownComponent } from 'src/app/shared/components/ta-details-dropdown/ta-details-dropdown';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaUserReviewComponent } from 'src/app/shared/components/ta-user-review/ta-user-review.component';
import { TaTruckassistProgressExpirationComponent } from 'src/app/shared/components/ta-truckassist-progress-expiration/ta-truckassist-progress-expiration.component';
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
import { TaSearchComponent } from 'src/app/shared/components/ta-search/ta-search.component';
import { TaFilterComponent } from 'src/app/shared/components/ta-filter/ta-filter.component';
import { ToDoListCardComponent } from './pages/to-do-list-card/to-do-list-card.component';

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
        TaSearchComponent,
        TaFilterComponent,
        AppTooltipComponent,
        TaUploadFilesComponent,
        TaDetailsDropdownComponent,
        TaTruckassistProgressExpirationComponent,
        TaUserReviewComponent,

        //Pipes
        FormatDatePipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ToDoModule {}
