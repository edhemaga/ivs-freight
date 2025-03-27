import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

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

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';
import { ModalService } from '@shared/services';

// enums
import { eMileTabs } from '@pages/miles/enums';
import {
    eActiveViewMode,
    eCommonElement,
    eGeneralActions,
    eSharedString,
} from '@shared/enums';
import { eTableEmpty } from '@shared/components/ta-table/ta-table-empty/enums';

// interfaces
import { IStateFilters } from '@shared/interfaces';

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
        CaSearchMultipleStates2Component,
        CaFilterStateDropdownComponent,
        CaFilterTimeDropdownComponent,
        MilesMapComponent,
        MilesCardComponent,
        MilesTableComponent,
        TaTableEmptyComponent,
    ],
})
export class MilesComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    private filter: IStateFilters = {};

    // enums
    public eSharedString = eSharedString;
    public eActiveViewMode = eActiveViewMode;
    public eCommonElement = eCommonElement;

    constructor(
        private modalService: ModalService,

        public milesStoreService: MilesStoreService
    ) {}

    ngOnInit(): void {
        this.storeSubscription();
    }

    private storeSubscription(): void {
        this.milesStoreService.filter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => (this.filter = res));
    }

    private handleTableEmptyImportListClick(): void {
        //TODO:
    }

    private handleTableEmptyAddClick(): void {
        this.modalService.openModal(TruckModalComponent, {
            size: eSharedString.SMALL,
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

    public onSearchQueryChange(query: string[]): void {
        // TODO remove, for easier emitted data preview
        console.log(query);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
