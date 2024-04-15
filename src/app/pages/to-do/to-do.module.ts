import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { GridsterModule } from 'angular-gridster2';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';

// moduels
import { ToDoRoutingModule } from '@pages/to-do/to-do-routing.module';
import { SharedModule } from '@shared/shared.module';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// components
import { TaDetailsDropdownComponent } from '@shared/components/ta-details-dropdown/ta-details-dropdown.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaUserReviewComponent } from '@shared/components/ta-user-review/ta-user-review.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaSearchComponent } from '@shared/components/ta-search/ta-search.component';
import { TaFilterComponent } from '@shared/components/ta-filter/ta-filter.component';
import { ToDoListCardComponent } from '@pages/to-do/pages/to-do-list-card/to-do-list-card.component';

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
        TaAppTooltipV2Component,
        TaUploadFilesComponent,
        TaDetailsDropdownComponent,
        TaProgressExpirationComponent,
        TaUserReviewComponent,

        //Pipes
        FormatDatePipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ToDoModule {}
