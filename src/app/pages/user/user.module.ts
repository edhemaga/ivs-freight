// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// routing
import { UserRoutingModule } from '@pages/user/user-routing.module';

// components
import { UserTableComponent } from '@pages/user/pages/user-table/user-table.component';
import { UserCardComponent } from '@pages/user/pages/user-card/user-card.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';

// pipes
import {
    CardValuePipe,
    FlipCardsPipe,
    FormatCurrencyPipe,
    FormatDatePipe,
    ActivityTimePipe,
} from '@shared/pipes';

// store
import { StoreModule } from '@ngrx/store';
import { userCardModalReducer } from '@pages/user/pages/user-card-modal/state';

@NgModule({
    imports: [
        // modules
        CommonModule,
        NgbTooltipModule,
        AngularSvgIconModule,
        UserRoutingModule,

        // components
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaAppTooltipV2Component,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,

        // pipes
        FormatDatePipe,
        FormatCurrencyPipe,
        FlipCardsPipe,
        CardValuePipe,
        ActivityTimePipe,

        // store
        StoreModule.forFeature('userCardData', userCardModalReducer),
    ],
    declarations: [UserTableComponent, UserCardComponent],
})
export class UserModule {}
