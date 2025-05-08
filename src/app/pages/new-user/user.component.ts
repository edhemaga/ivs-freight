import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Modules
import { NgbActiveModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
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
    eColor,
    ePosition,
    CaFilterListDropdownComponent,
    IFilterAction,
} from 'ca-components';
import { UserTableComponent } from '@pages/new-user/pages/user-table/user-table.component';
import { UserCardsComponent } from '@pages/new-user/pages/user-cards/user-cards.component';

// Models
import { TableCardBodyActions, TableToolbarActions } from '@shared/models';

// Enums
import {
    eGeneralActions,
    eStatusTab,
    eDropdownMenuColumns,
} from '@shared/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Pipes
import { ActivateIconTooltipPipe } from '@shared/pipes/activate-icon-tooltip.pipe';

// Interfaces
import { IMappedUser } from '@pages/new-user/interfaces';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
    standalone: true,
    providers: [NgbActiveModal],
    imports: [
        // modules
        CommonModule,
        NgbTooltip,
        AngularSvgIconModule,

        // Components
        NewTableToolbarComponent,
        ToolbarTabsWrapperComponent,
        CaSearchMultipleStates2Component,
        CaFilterListDropdownComponent,
        SvgIconComponent,
        CaCheckboxSelectedCountComponent,
        TaAppTooltipV2Component,
        UserTableComponent,
        UserCardsComponent,

        // Pipes
        ActivateIconTooltipPipe,
    ],
})
export class UserComponent {
    // Shared routes
    public sharedIcons = SharedSvgRoutes;

    // Enums
    public generalActions = eGeneralActions;
    public eCommonElement = eCommonElement;
    public eStatusTab = eStatusTab;
    public eColor = eColor;
    public ePosition = ePosition;

    constructor(
        public userStoreService: UserStoreService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    public onToolBarAction(event: TableToolbarActions): void {
        if (!event) return;

        const { action, mode } = event;

        switch (action) {
            case eGeneralActions.OPEN_MODAL:
                this.userStoreService.dispatchOpenUserModal(false, null);
                break;

            case eGeneralActions.TAB_SELECTED:
                this.onTypeChange(mode);
                break;

            case eGeneralActions.VIEW_MODE:
                this.onViewModeChange(mode);
                break;
        }
    }

    public onSearchQueryChange(query: string[]): void {
        this.userStoreService.dispatchSearchChange(query);
    }

    public onToolbarDropdownMenuActions<T>(action: TableCardBodyActions<T>) {
        const { type, isActive } = action;
        switch (type) {
            case eDropdownMenuColumns.OPEN_TYPE:
                break;
            case eDropdownMenuColumns.CLOSE_TYPE:
                this.setToolbarDropdownMenuColumnsActive(false);
                break;
            case eDropdownMenuColumns.COLUMNS_TYPE:
                this.setToolbarDropdownMenuColumnsActive(true);
                break;
            case eDropdownMenuColumns.COLUMNS_BACK_TYPE:
                this.setToolbarDropdownMenuColumnsActive(false);
                break;
            default:
                this.toggleColumnVisibility(type, isActive);
                break;
        }
    }

    public onDeleteUserList(users: IMappedUser[]): void {
        this.userStoreService.dispatchDeleteUsers(
            { users },
            this.ngbActiveModal
        );
    }

    public oUserStatusChange(users: IMappedUser[]): void {
        this.userStoreService.dispatchUserStatusChange(
            { users },
            this.ngbActiveModal
        );
    }

    public setFilters(filters: IFilterAction): void {
        this.userStoreService.dispatchFiltersChange(filters);
    }

    private onTypeChange(mode: string): void {
        this.userStoreService.dispatchTypeChange(mode as eStatusTab);
    }

    private onViewModeChange(viewMode: string): void {
        this.userStoreService.dispatchViewModeChange(
            viewMode as eCommonElement
        );
    }

    private setToolbarDropdownMenuColumnsActive(isActive: boolean): void {
        this.userStoreService.dispatchSetToolbarDropdownMenuColumnsActive(
            isActive
        );
    }

    private toggleColumnVisibility(columnType: string, isChecked): void {
        this.userStoreService.dispatchToggleColumnsVisibility(
            columnType,
            isChecked
        );
    }
}
