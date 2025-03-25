import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// components
import { ToolbarTabsWrapperComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs-wrapper/toolbar-tabs-wrapper.component';
import { NewTableToolbarComponent } from '@shared/components/new-table-toolbar/new-table-toolbar.component';
import {
    CaFilterComponent,
    CaSearchMultipleStatesComponent,
    IFilterAction,
    CaFilterStateDropdownComponent,
    CaFilterTimeDropdownComponent,
} from 'ca-components';
import { MilesMapComponent } from '@pages/miles/pages/miles-map/miles-map.component';
import { MilesCardComponent } from '@pages/miles/pages/miles-card/miles-card.component';
import { MilesTableComponent } from '@pages/miles/pages/miles-table/miles-table.component';
import { TaTableEmptyComponent } from '@shared/components/ta-table/ta-table-empty/ta-table-empty.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';
import { ModalService } from '@shared/services';

// enums
import { eMileTabs } from '@pages/miles/enums';
import {
    eActiveViewMode,
    eCommonElement,
    eDropdownMenu,
    eDropdownMenuColumns,
    eGeneralActions,
    eSharedString,
    TableStringEnum,
} from '@shared/enums';
import { eTableEmpty } from '@shared/components/ta-table/ta-table-empty/enums';

// interfaces
import { IStateFilters } from '@shared/interfaces';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { DropdownMenuActionsBase } from '@shared/base-classes';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';
import { TableCardBodyActions } from '@shared/models';
import { MilesDropdownMenuHelper } from './utils/helpers/miles-dropdown-menu.helper';
import { DropdownMenuColumnsActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

@Component({
    selector: 'app-miles',
    templateUrl: './miles.component.html',
    styleUrls: ['./miles.component.scss'],
    standalone: true,
    imports: [
        CommonModule,

        // Components
        NewTableToolbarComponent,
        ToolbarTabsWrapperComponent,
        CaFilterComponent,
        CaSearchMultipleStatesComponent,
        CaFilterStateDropdownComponent,
        CaFilterTimeDropdownComponent,
        MilesMapComponent,
        MilesCardComponent,
        MilesTableComponent,
        TaTableEmptyComponent,
    ],
})
export class MilesComponent
    extends DropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    protected destroy$ = new Subject<void>();

    private filter: IStateFilters = {};

    // enums
    public eSharedString = eSharedString;
    public eActiveViewMode = eActiveViewMode;
    public eCommonElement = eCommonElement;
    public eGeneralActions = eGeneralActions;

    public toolbarDropdownMenuOptions: IDropdownMenuItem[] = [];
    private isTableLocked: boolean = true;
    private isToolbarDropdownMenuColumnsActive: boolean = false;

    constructor(
        public milesStoreService: MilesStoreService,
        protected modalService: ModalService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService
    ) {
        super();
    }

    ngOnInit(): void {
        this.storeSubscription();
    }

    private storeSubscription(): void {
        this.milesStoreService.filter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => (this.filter = res));
    }

    private setToolbarDropdownMenuContent(
        isTableLocked: boolean,
        isColumnsDropdownActive: boolean,
        milesColumnsList?: IDropdownMenuItem[]
    ): void {
        this.toolbarDropdownMenuOptions =
            MilesDropdownMenuHelper.getToolbarDropdownMenuContent(
                isTableLocked,
                isColumnsDropdownActive,
                milesColumnsList
            );
    }

    private updateToolbarDropdownMenuContentColumnsAction(): void {
        this.isToolbarDropdownMenuColumnsActive =
            !this.isToolbarDropdownMenuColumnsActive;

        const milesColumns =
            DropdownMenuColumnsActionsHelper.getDropdownMenuColumnsContentNew();

        this.setToolbarDropdownMenuContent(
            this.isTableLocked,
            this.isToolbarDropdownMenuColumnsActive,
            milesColumns
        );
    }

    private handleTableEmptyImportListClick(): void {
        //TODO:
    }

    private handleTableEmptyAddClick(): void {
        this.modalService.openModal(TruckModalComponent, {
            size: TableStringEnum.SMALL,
        });
    }

    public setFilters(filters: IFilterAction): void {
        this.milesStoreService.dispatchFilters(filters, this.filter);
    }

    public onToolBarAction(event: { mode: eMileTabs; action: string }): void {
        const { action, mode } = event || {};

        if (action === eGeneralActions.TAB_SELECTED) {
            this.milesStoreService.dispatchListChange(mode);
        } else if (action === eGeneralActions.VIEW_MODE) {
            this.milesStoreService.dispatchSetActiveViewMode(
                eActiveViewMode[mode]
            );
        }
    }

    public onTableEmptyBtnClick(btnClickType: string): void {
        switch (btnClickType) {
            case eTableEmpty.ADD_CLICK:
                this.handleTableEmptyAddClick();

                break;
            case eTableEmpty.IMPORT_LIST_CLICK:
                this.handleTableEmptyImportListClick();

                break;
            default:
                // reset filters

                break;
        }
    }

    public handleToolbarDropdownMenuActions<T>(
        action: TableCardBodyActions<T>
    ) {
        const mappedAction = {
            ...action,
            // subType: DropdownMenuColumnsActionsHelper.getTableType(
            //     this.selectedTab
            // ),
        };

        this.handleSharedDropdownMenuActions(mappedAction, eDropdownMenu.MILES);
    }

    public updateToolbarDropdownMenuContent(action?: string): void {
        if (!action) {
            this.isToolbarDropdownMenuColumnsActive = false;

            this.setToolbarDropdownMenuContent(
                this.isTableLocked,
                this.isToolbarDropdownMenuColumnsActive
            );

            return;
        }

        switch (action) {
            case eDropdownMenuColumns.UNLOCK_TABLE_TYPE:
            case eDropdownMenuColumns.LOCK_TABLE_TYPE:
                // this.updateToolbarDropdownMenuContentUnlockLockAction();

                break;
            case eDropdownMenuColumns.COLUMNS_TYPE:
                this.updateToolbarDropdownMenuContentColumnsAction();

                break;
            default:
        }
    }

    public handleShowMoreAction(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
