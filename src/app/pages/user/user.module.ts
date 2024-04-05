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
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';
import { TaTableBodyComponent } from 'src/app/shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from 'src/app/shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaTableToolbarComponent } from 'src/app/shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';

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
        AppTooltipComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
    ],
    declarations: [UserTableComponent, UserCardComponent],
})
export class UserModule {}
