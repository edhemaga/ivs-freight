import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

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
import { TaTableEmptyComponent } from '@shared/components/ta-table/ta-table-empty/ta-table-empty.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { ConfirmationResetModalComponent } from '@shared/components/ta-shared-modals/confirmation-reset-modal/confirmation-reset-modal.component';
import { MilesCardComponent } from '@pages/miles/pages/miles-card/miles-card.component';

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
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { IMilesModel } from '@pages/miles/interface';

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
    @ViewChild(MilesCardComponent) milesCardComponent!: MilesCardComponent;

    protected destroy$ = new Subject<void>();

    private filter: IStateFilters = {};

    // enums
    public eSharedString = eSharedString;
    public eActiveViewMode = eActiveViewMode;
    public eCommonElement = eCommonElement;

    public toolbarDropdownMenuOptions: IDropdownMenuItem[] = [];
    public firstUnit: IMilesModel;

    constructor(
        protected modalService: ModalService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService,
        public milesStoreService: MilesStoreService,
        public router: Router
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
            this.milesStoreService.miles$,
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([filter, toolbarDropdownMenuOptions, units]) => {
                this.filter = filter;
                this.toolbarDropdownMenuOptions = toolbarDropdownMenuOptions;
                this.firstUnit = units[0] || ({} as IMilesModel);
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
        } else if (action === eGeneralActions.VIEW_MODE) {
            this.redirectUserToNewView(mode);
        }
    }

    private redirectUserToNewView(mode: eMileTabs): void {
        this.milesStoreService.dispatchSetActiveViewMode(eActiveViewMode[mode]);

        if (mode === eActiveViewMode[eActiveViewMode.Map]) {
            // What if we don't have a unit? should user be able to go to map?
            this.router.navigate([
                `/${eMilesRouting.BASE}/${eMilesRouting.MAP}/${this.firstUnit.truckId}`,
            ]);
        } else {
            this.router.navigate([
                `/${eMilesRouting.BASE}/${mode.toLowerCase()}`,
            ]);
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

    public onSearchQueryChange(query: string[]): void {
        // TODO remove, for easier emitted data preview
        console.log(query);
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
                this.milesCardComponent.openColumnsModal();

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
