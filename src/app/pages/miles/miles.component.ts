import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { combineLatest, Subject, takeUntil } from 'rxjs';

// components
import { ToolbarTabsWrapperComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs-wrapper/toolbar-tabs-wrapper.component';
import { NewTableToolbarComponent } from '@shared/components/new-table-toolbar/new-table-toolbar.component';
import {
    CaFilterComponent,
    CaSearchMultipleStates2Component,
    IFilterAction,
    CaFilterStateDropdownComponent,
    CaSortingCardDropdownComponent,
} from 'ca-components';
import { TaTableEmptyComponent } from '@shared/components/ta-table/ta-table-empty/ta-table-empty.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { ConfirmationResetModalComponent } from '@shared/components/ta-shared-modals/confirmation-reset-modal/confirmation-reset-modal.component';
import { MilesTableComponent } from '@pages/miles/pages/miles-table/miles-table.component';
import { MilesCardComponent } from '@pages/miles/pages/miles-card/miles-card.component';
import { MilesMapComponent } from '@pages/miles/pages/miles-map/miles-map.component';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';
import { ModalService } from '@shared/services';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// enums
import { eMileTabs, eMilesRouting } from '@pages/miles/enums';
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
import { IMappedMiles } from '@pages/miles/interfaces';
import { ITableColumn } from '@shared/components/new-table/interfaces';

@Component({
    selector: 'app-miles',
    templateUrl: './miles.component.html',
    styleUrls: ['./miles.component.scss'],
    standalone: true,
    imports: [
        CommonModule,

        // components
        NewTableToolbarComponent,
        ToolbarTabsWrapperComponent,
        CaFilterComponent,
        CaSearchMultipleStates2Component,
        CaFilterStateDropdownComponent,
        TaTableEmptyComponent,
        CaSortingCardDropdownComponent,
        MilesTableComponent,
        MilesCardComponent,
        MilesMapComponent,
    ],
})
export class MilesComponent
    extends DropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    @ViewChild(CaSearchMultipleStates2Component)
    searchComponent: CaSearchMultipleStates2Component;
    @ViewChild(CaFilterComponent)
    stateFilter: CaFilterStateDropdownComponent;
    @ViewChild(CaFilterComponent)
    moneyFilter: CaFilterComponent;

    protected destroy$ = new Subject<void>();

    private filter: IStateFilters = {};

    // enums
    public eSharedString = eSharedString;
    public eActiveViewMode = eActiveViewMode;
    public eCommonElement = eCommonElement;

    public firstUnit: IMappedMiles;

    constructor(
        public router: Router,

        // services
        protected modalService: ModalService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService,
        public milesStoreService: MilesStoreService
    ) {
        super();
    }

    ngOnInit(): void {
        this.storeSubscription();
    }

    private storeSubscription(): void {
        combineLatest([
            this.milesStoreService.filter$,
            this.milesStoreService.miles$,
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([filter, units]) => {
                this.filter = filter;
                this.firstUnit = units[0] || ({} as IMappedMiles);
            });
    }

    private setToolbarDropdownMenuColumnsActive(isActive: boolean): void {
        this.milesStoreService.dispatchSetToolbarDropdownMenuColumnsActive(
            isActive
        );
    }

    private handleTableEmptyImportListClick(): void {
        //TODO:
    }

    private handleTableEmptyAddClick(): void {
        this.modalService
            .openModalNew(TruckModalComponent, {
                size: eSharedString.SMALL,
                isDispatchCall: true,
            })
            .closed.subscribe((value) => {
                if (value) this.milesStoreService.dispatchGetMiles();
            });
    }

    private handleTableLockingStatus(isTableLocked?: boolean): void {
        this.milesStoreService.toggleTableLockingStatus(isTableLocked);
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
        this.milesStoreService.dispatchToggleColumnsVisibility(
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
        } else if (action === eGeneralActions.VIEW_MODE) {
            this.redirectUserToNewView(mode);
        }
    }

    private redirectUserToNewView(mode: eMileTabs): void {
        if (mode === eActiveViewMode[eActiveViewMode.Map]) {
            this.router.navigate([
                `/${eMilesRouting.BASE}/${eMilesRouting.MAP}/${this.firstUnit.truckId}`,
            ]);
        } else {
            this.router.navigate([`/${eMilesRouting.BASE}`]);

            this.milesStoreService.dispatchSetActiveViewMode(
                eActiveViewMode[mode]
            );
        }
    }

    private openColumnsModal(): void {
        this.milesStoreService.dispatchOpenColumnsModal();
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
                this.handleFilterReset();

                break;
        }
    }

    public handleFilterReset(): void {
        this.milesStoreService.dispatchResetFilters();

        this.searchComponent.clearAll();

        this.stateFilter.clearValues(true);
        this.moneyFilter.clearAllValues();
    }

    public onSearchQueryChange(query: string[]): void {
        this.milesStoreService.dispatchSearchChange(query);
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
                this.openColumnsModal();

                break;
            default:
                this.toggleColumnVisibility(type, isActive);

                break;
        }
    }

    public onSelectSortItem(column: ITableColumn): void {
        this.milesStoreService.dispatchSortingChange(column);
    }

    ngOnDestroy(): void {
        this.handleTableLockingStatus(true);

        this.destroy$.next();
        this.destroy$.complete();
    }
}
