// External Libraries
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// Shared Components
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

// Feature Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// Enums
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

// Interfaces
import { IStateFilters } from '@shared/interfaces';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { DropdownMenuActionsBase } from '@shared/base-classes';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';
import { TableCardBodyActions } from '@shared/models';
import { MilesDropdownMenuHelper } from './utils/helpers/miles-dropdown-menu.helper';
import { DropdownMenuColumnsActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { eTableEmpty } from '@shared/components/ta-table/ta-table-empty/enums';
import { ModalService } from '@shared/services';

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

    public toolbarDropdownMenuOptions: IDropdownMenuItem[] = [];
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

    public toggleTableLockingStatus(): void {
        this.milesStoreService.toggleTableLockingStatus();
    }

    private storeSubscription(): void {
        this.milesStoreService.filter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => (this.filter = res));
    }

    private setToolbarDropdownMenuContent(
        isColumnsDropdownActive: boolean,
        milesColumnsList?: IDropdownMenuItem[]
    ): void {
        let isTableLocked;
        this.milesStoreService.tableSettingsSelector$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => (isTableLocked = res.isTableLocked));

        console.log('isTableLocked', isTableLocked)
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
        const { type, isActive } = action;

        switch (type) {
            case eDropdownMenuColumns.OPEN_TYPE:
                this.isToolbarDropdownMenuColumnsActive = false;

                this.setToolbarDropdownMenuContent(
                    this.isToolbarDropdownMenuColumnsActive
                );

                break;
            case eDropdownMenuColumns.COLUMNS_TYPE:
                this.updateToolbarDropdownMenuContentColumnsAction();

                break;
            case eDropdownMenuColumns.UNLOCK_TABLE_TYPE:
            case eDropdownMenuColumns.LOCK_TABLE_TYPE:
                this.toggleTableLockingStatus();
                this.setToolbarDropdownMenuContent(
                    this.isToolbarDropdownMenuColumnsActive
                );
                break;
            case eDropdownMenuColumns.RESET_TABLE_TYPE:
                // this.handleResetTableAction(subType);

                break;
            case eDropdownMenuColumns.RESET_TABLE_CONFIRMED_TYPE:
                // this.handleResetTableConfirmedAction(subType);

                break;
            default:
                this.milesStoreService.dispatchToggleColumnsVisiblity(
                    type,
                    isActive
                );

                break;
        }
        //
    }

    public handleShowMoreAction(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
