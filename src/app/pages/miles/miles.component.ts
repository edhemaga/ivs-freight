import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { combineLatest, Subject, takeUntil } from 'rxjs';

// components
import { ToolbarTabsWrapperComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs-wrapper/toolbar-tabs-wrapper.component';
import { NewTableToolbarComponent } from '@shared/components/new-table-toolbar/new-table-toolbar.component';
import {
    CaFilterComponent,
    CaSearchMultipleStates2Component,
    IFilterAction,
    CaFilterStateDropdownComponent,
    CaFilterTimeDropdownComponent,
} from 'ca-components';
import { MilesMapComponent } from '@pages/miles/pages/miles-map/miles-map.component';
import { MilesCardComponent } from '@pages/miles/pages/miles-card/miles-card.component';
import { MilesTableComponent } from '@pages/miles/pages/miles-table/miles-table.component';
import { TaTableEmptyComponent } from '@shared/components/ta-table/ta-table-empty/ta-table-empty.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { ConfirmationResetModalComponent } from '@shared/components/ta-shared-modals/confirmation-reset-modal/confirmation-reset-modal.component';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';
import { ModalService } from '@shared/services';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// enums
import { eMileTabs } from '@pages/miles/enums';
import {
    eActiveViewMode,
    eCommonElement,
    eDropdownMenu,
    eDropdownMenuColumns,
    eGeneralActions,
    eSharedString,
} from '@shared/enums';
import { eTableEmpty } from '@shared/components/ta-table/ta-table-empty/enums';

// models
import { TableCardBodyActions } from '@shared/models';

// interfaces
import { IStateFilters } from '@shared/interfaces';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-miles',
    templateUrl: './miles.component.html',
    styleUrls: ['./miles.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,

        // Components
        NewTableToolbarComponent,
        ToolbarTabsWrapperComponent,
        CaFilterComponent,
        CaSearchMultipleStates2Component,
        CaFilterStateDropdownComponent,
        CaFilterTimeDropdownComponent,
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

    public toolbarDropdownMenuOptions: IDropdownMenuItem[] = [];

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
        combineLatest([
            this.milesStoreService.filter$,
            this.milesStoreService.toolbarDropdownMenuOptionsSelector$,
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([filter, toolbarDropdownMenuOptions]) => {
                this.filter = filter;
                this.toolbarDropdownMenuOptions = toolbarDropdownMenuOptions;
            });
    }

    private toggleToolbarDropdownMenuColumnsActive(): void {
        this.milesStoreService.dispatchToggleToolbarDropdownMenuColumnsActive();
    }

    private handleTableEmptyImportListClick(): void {
        //TODO:
    }

    private handleTableEmptyAddClick(): void {
        this.modalService.openModal(TruckModalComponent, {
            size: eSharedString.SMALL,
        });
    }

    private handleTableLockingStatus(): void {
        this.milesStoreService.toggleTableLockingStatus();
    }

    private handleResetTable(): void {
        this.milesStoreService.dispatchResetTable();
    }

    private openResetConfirmationModal(): void {
        this.modalService.openModal(
            ConfirmationResetModalComponent,
            { size: eDropdownMenu.SMALL },
            {
                template: eGeneralActions.RESET_MODAL,
                type: eGeneralActions.RESET,
                modalTitle: 'List | Miles',
                tableType: 'Miles',
            }
        );
    }

    private handleFlipAllCards(): void {
        this.milesStoreService.dispatchToggleCardFlipViewMode();
    }

    private toggleColumnVisibility(columnType: string, isChecked): void {
        this.milesStoreService.dispatchToggleColumnsVisiblity(
            columnType,
            isChecked
        );
    }

    public handleShowMoreAction(): void {}

    public setFilters(filters: IFilterAction): void {
        this.milesStoreService.dispatchFilters(filters, this.filter);
    }

    public onToolBarAction(event: { mode: eMileTabs; action: string }): void {
        const { action, mode } = event || {};

        if (action === eGeneralActions.TAB_SELECTED) {
            this.milesStoreService.dispatchListChange(mode);
        } else if (action === eGeneralActions.VIEW_MODE)
            this.milesStoreService.dispatchSetActiveViewMode(
                eActiveViewMode[mode]
            );
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

    public onSearchQueryChange(query: string[]): void {
        // TODO remove, for easier emitted data preview
        console.log(query);
    }

    public onToolbarDropdownMenuActions<T>(action: TableCardBodyActions<T>) {
        const { type, isActive } = action;

        switch (type) {
            case eDropdownMenuColumns.OPEN_TYPE:
            case eDropdownMenuColumns.CLOSE_TYPE:
                break;
            case eDropdownMenuColumns.COLUMNS_TYPE:
                this.toggleToolbarDropdownMenuColumnsActive();

                break;
            case eDropdownMenuColumns.UNLOCK_TABLE_TYPE:
            case eDropdownMenuColumns.LOCK_TABLE_TYPE:
                this.handleTableLockingStatus();

                break;
            case eDropdownMenuColumns.RESET_TABLE_TYPE:
                this.openResetConfirmationModal();
                break;
            case eDropdownMenuColumns.RESET_TABLE_CONFIRMED_TYPE:
                this.handleResetTable();
                break;
            case eDropdownMenuColumns.FLIP_ALL_CARDS_TYPE:
                this.handleFlipAllCards();
                break;
            case eDropdownMenuColumns.COLUMNS_CARD_TYPE:
                // TODO - open miles card modal
                break;
            default:
                this.toggleColumnVisibility(type, isActive);

                break;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
