import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// modules
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import {
    eActiveViewMode,
    eDropdownMenu,
    eDropdownMenuColumns,
    eGeneralActions,
} from '@shared/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// Models
import { IGetLoadListParam } from '@pages/load/pages/load-table/models';
import { TableCardBodyActions, TableToolbarActions } from '@shared/models';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';
import { ModalService } from '@shared/services/modal.service';

// Components
import { ToolbarTabsWrapperComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs-wrapper/toolbar-tabs-wrapper.component';
import { NewTableToolbarComponent } from '@shared/components/new-table-toolbar/new-table-toolbar.component';
import {
    CaFilterComponent,
    CaFilterListDropdownComponent,
    CaFilterTimeDropdownComponent,
    CaSearchMultipleStates2Component,
    IFilterAction,
} from 'ca-components';
import { NewLoadCardsComponent } from '@pages/new-load/pages/new-load-cards/new-load-cards.component';
import { NewLoadTableComponent } from '@pages/new-load/pages/new-load-table/new-load-table.component';
import { SvgIconComponent } from 'angular-svg-icon';

// Constants
import { TableDropdownComponentConstants } from '@shared/utils/constants';

// Helpers
import { FilterHelper } from '@shared/utils/helpers';
import { LoadTableHelper } from '@pages/load/pages/load-table/utils/helpers';
import { DropdownMenuColumnsActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Interface
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

// Base class
import { LoadDropdownMenuActionsBase } from '@pages/load/base-classes';

@Component({
    selector: 'app-new-load',
    templateUrl: './new-load.component.html',
    styleUrl: './new-load.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        NgbTooltipModule,
        AngularSvgIconModule,

        // Components
        NewTableToolbarComponent,
        NewLoadCardsComponent,
        NewLoadTableComponent,
        ToolbarTabsWrapperComponent,
        CaFilterComponent,
        CaFilterTimeDropdownComponent,
        CaFilterListDropdownComponent,
        CaSearchMultipleStates2Component,
        SvgIconComponent,
    ],
})
export class NewLoadComponent extends LoadDropdownMenuActionsBase {
    // enums
    public eLoadStatusStringType = eLoadStatusStringType;
    public generalActions = eGeneralActions;

    public selectedTab = eLoadStatusStringType.ACTIVE;

    // filter
    private filter: IGetLoadListParam = TableDropdownComponentConstants.FILTER;

    private isToolbarDropdownMenuColumnsActive: boolean = false;
    public isTableLocked: boolean = false;

    // dropdown
    public toolbarDropdownMenuOptions: IDropdownMenuItem[] = [];

    // icons
    public sharedIcons = SharedSvgRoutes;

    constructor(
        // router
        protected router: Router,

        // services
        protected modalService: ModalService,
        protected loadStoreService: LoadStoreService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService
    ) {
        super();
    }

    public onToolBarAction(event: TableToolbarActions): void {
        if (!event) return;

        const { action, mode } = event;

        switch (action) {
            case eGeneralActions.OPEN_MODAL:
                this.handleOpenModal();
                break;

            case eGeneralActions.TAB_SELECTED:
                this.handleTabSelected(mode);
                break;

            case eGeneralActions.VIEW_MODE:
                this.handleViewModeChange(mode);
                break;
        }
    }

    public setFilters(filters: IFilterAction): void {
        const selectedTab: eLoadStatusType = eLoadStatusType[this.selectedTab];

        this.loadStoreService.dispatchGetList(
            {
                ...FilterHelper.mapFilters(filters, this.filter),
                statusType: selectedTab,
            },
            selectedTab
        );
    }

    public handleToolbarDropdownMenuActions<T>(
        action: TableCardBodyActions<T>
    ) {
        const mappedAction = {
            ...action,
            subType: DropdownMenuColumnsActionsHelper.getTableType(
                this.selectedTab
            ),
        };

        this.handleDropdownMenuActions(mappedAction, eDropdownMenu.LOAD);
    }

    public handleShowMoreAction(): void {}

    public updateToolbarDropdownMenuContent(action?: string): void {
        if (!action) {
            this.isToolbarDropdownMenuColumnsActive = false;

            this.setToolbarDropdownMenuContent(
                this.selectedTab,
                this.isTableLocked,
                this.isToolbarDropdownMenuColumnsActive
            );

            return;
        }

        switch (action) {
            case eDropdownMenuColumns.UNLOCK_TABLE_TYPE:
            case eDropdownMenuColumns.LOCK_TABLE_TYPE:
                this.updateToolbarDropdownMenuContentUnlockLockAction();

                break;
            case eDropdownMenuColumns.COLUMNS_TYPE:
                this.updateToolbarDropdownMenuContentColumnsAction();

                break;
            default:
                break;
        }
    }

    private updateToolbarDropdownMenuContentUnlockLockAction(): void {
        this.isTableLocked = !this.isTableLocked;

        this.setToolbarDropdownMenuContent(
            this.selectedTab,
            this.isTableLocked,
            this.isToolbarDropdownMenuColumnsActive
        );
    }

    private updateToolbarDropdownMenuContentColumnsAction(): void {
        this.isToolbarDropdownMenuColumnsActive =
            !this.isToolbarDropdownMenuColumnsActive;

        const loadColumns =
            DropdownMenuColumnsActionsHelper.getDropdownMenuColumnsContent(
                this.selectedTab
            );

        this.setToolbarDropdownMenuContent(
            this.selectedTab,
            this.isTableLocked,
            this.isToolbarDropdownMenuColumnsActive,
            loadColumns
        );
    }

    private handleOpenModal(): void {
        // TODO: Denis Implement modal opening logic
    }

    private setToolbarDropdownMenuContent(
        selectedTab: string,
        isTableLocked: boolean,
        isColumnsDropdownActive: boolean,
        loadColumnsList?: IDropdownMenuItem[]
    ): void {
        this.toolbarDropdownMenuOptions =
            LoadTableHelper.getToolbarDropdownMenuContent(
                selectedTab,
                isTableLocked,
                isColumnsDropdownActive,
                loadColumnsList
            );
    }

    private handleTabSelected(mode: string): void {
        this.selectedTab = mode as eLoadStatusStringType;
        this.resetFilters();
        this.getLoadStatusFilter();
    }

    private resetFilters(): void {
        this.filter = {
            statusType: eLoadStatusType[this.selectedTab],
            pageIndex: 1,
            pageSize: 25,
        };
    }

    private handleViewModeChange(mode: string): void {
        this.loadStoreService.dispatchSetActiveViewMode(eActiveViewMode[mode]);
    }

    private getLoadStatusFilter(): void {
        if (this.selectedTab === eLoadStatusStringType.TEMPLATE) {
            this.loadStoreService.dispatchLoadTemplateList(this.filter);
        } else {
            this.loadStoreService.loadDispatchFilters({
                loadStatusType: this.selectedTab,
            });

            this.loadStoreService.dispatchGetList(
                this.filter,
                eLoadStatusType[this.selectedTab]
            );
        }
    }

    public onSearchQueryChange(query: string[]): void {
        // TODO remove, for easier emitted data preview
        console.log(query);
    }
}
