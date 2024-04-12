// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// routing
import { UserRoutes } from './user.routing';

// components
import { UserTableComponent } from './pages/user-table/user-table.component';
import { UserCardComponent } from './pages/user-card/user-card.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';

@NgModule({
    imports: [
        // modules
        CommonModule,
        NgbTooltipModule,
        AngularSvgIconModule,

        // routing
        UserRoutes,

        // components
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaAppTooltipV2Component,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
    ],
    declarations: [UserTableComponent, UserCardComponent],
})
export class UserModule {}
