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
    eCommonElement,
} from 'ca-components';
import { UserTableComponent } from '@pages/new-user/pages/user-table/user-table.component';
import { UserCardsComponent } from '@pages/new-user/pages/user-cards/user-cards.component';

// Models
import { TableCardBodyActions, TableToolbarActions } from '@shared/models';

// Enums
import { eGeneralActions, eStatusTab } from '@shared/enums';

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
        UserTableComponent,
        UserCardsComponent,
    ],
})
export class UserComponent {
    // Shared routes
    public sharedIcons = SharedSvgRoutes;

    // Enums
    public generalActions = eGeneralActions;
    public eCommonElement = eCommonElement;
    public eStatusTab = eStatusTab;

    constructor(public userStoreService: UserStoreService) {}

    public onToolBarAction(event: TableToolbarActions): void {
        if (!event) return;

        const { action, mode } = event;

        switch (action) {
            case eGeneralActions.OPEN_MODAL:
                break;

            case eGeneralActions.TAB_SELECTED:
                this.onTypeChange(mode);
                break;

            case eGeneralActions.VIEW_MODE:
                this.onViewModeChange(mode);
                break;
        }
    }

    public onToolbarDropdownMenuActions<T>(action: TableCardBodyActions<T>) {}

    private onTypeChange(mode: string): void {
        this.userStoreService.dispatchTypeChange(mode as eStatusTab);
    }

    private onViewModeChange(viewMode: string): void {
        this.userStoreService.dispatchViewModeChange(
            viewMode as eCommonElement
        );
    }
}
