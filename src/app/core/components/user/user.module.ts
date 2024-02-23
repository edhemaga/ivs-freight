// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// routing
import { UserRoutes } from './user.routing';

// components
import { UserTableComponent } from './user-table/user-table.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { UserCardComponent } from './user-card/user-card.component';
import { TaNoteComponent } from '../shared/ta-note/ta-note.component';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TableCardDropdownActionsComponent } from '../standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';

@NgModule({
    imports: [
        // modules
        CommonModule,
        NgbTooltipModule,
        AngularSvgIconModule,

        // routing
        UserRoutes,

        // components
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        AppTooltipComponent,
        TaNoteComponent,
        TableCardDropdownActionsComponent,
    ],
    declarations: [UserTableComponent, UserCardComponent],
})
export class UserModule {}
