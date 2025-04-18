import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Modules
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule, SvgIconComponent } from 'angular-svg-icon';

// Services
import { UserStoreService } from '@pages/new-user/state/services/user-store.service';

// Components
import { ToolbarTabsWrapperComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs-wrapper/toolbar-tabs-wrapper.component';
import { NewTableToolbarComponent } from '@shared/components/new-table-toolbar/new-table-toolbar.component';
import {
    CaSearchMultipleStates2Component,
    CaCheckboxSelectedCountComponent,
} from 'ca-components';

// Models
import { TableCardBodyActions, TableToolbarActions } from '@shared/models';

// Enums
import { eGeneralActions } from '@shared/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        NgbTooltipModule,
        AngularSvgIconModule,

        // Components
        NewTableToolbarComponent,
        ToolbarTabsWrapperComponent,
        CaSearchMultipleStates2Component,
        SvgIconComponent,
        CaCheckboxSelectedCountComponent,
    ],
})
export class UserComponent {
    // Shared routes
    public sharedIcons = SharedSvgRoutes;

    // Enums
    public generalActions = eGeneralActions;

    constructor(public userStoreService: UserStoreService) {}

    public onToolBarAction(event: TableToolbarActions): void {
        if (!event) return;
    }

    public onToolbarDropdownMenuActions<T>(action: TableCardBodyActions<T>) {}
}
