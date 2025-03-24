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
    eSharedString,
    TableStringEnum,
} from '@shared/enums';

// Interfaces
import { IStateFilters } from '@shared/interfaces';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import { DropdownMenuActionsBase } from '@shared/base-classes';
import { ModalService } from '@shared/services/modal.service';
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

        console.log(milesColumns);

        this.setToolbarDropdownMenuContent(
            this.isTableLocked,
            this.isToolbarDropdownMenuColumnsActive,
            milesColumns
        );
    }

    public onToolBarAction(event: { mode: eMileTabs; action: string }): void {
        const { action, mode } = event || {};
        if (action === TableStringEnum.TAB_SELECTED) {
            this.milesStoreService.dispatchListChange(mode);
        } else if (action === TableStringEnum.VIEW_MODE) {
            this.milesStoreService.dispatchSetActiveViewMode(
                eActiveViewMode[mode]
            );
        }
    }

    public setFilters(filters: IFilterAction): void {
        this.milesStoreService.dispatchFilters(filters, this.filter);
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

        console.log(action);

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
                break;
        }
    }

    public handleShowMoreAction(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
