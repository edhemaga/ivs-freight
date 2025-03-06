// External Libraries
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

// Feature Selectors
import {
    selectTableViewData,
    selectSelectedTab,
    selectMilesItems,
    activeViewModeSelector,
    filterSelector,
    statesSelector,
    selectedRowsSelector,
    tableColumnsSelector
} from '@pages/miles/state/selectors/miles.selector';

// Shared Components
import { ToolbarTabsWrapperComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs-wrapper/toolbar-tabs-wrapper.component';
import { NewTableToolbarComponent } from '@shared/components/new-table-toolbar/new-table-toolbar.component';
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { TaTruckTrailerIconComponent } from '@shared/components/ta-truck-trailer-icon/ta-truck-trailer-icon.component';
import {
    CaFilterComponent,
    CaSearchMultipleStatesComponent,
    CaFilterDropdownComponent,
    IFilterAction,
    CaFilterStateDropdownComponent,
    CaFilterTimeDropdownComponent
} from 'ca-components';

// Feature Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// Enums
import { eMileTabs } from '@pages/miles/enums';
import { TableStringEnum } from '@shared/enums';
import { eActiveViewMode } from '@shared/enums';

// Models
import { MilesStateFilterResponse } from 'appcoretruckassist';
import { IMilesModel, IMilesState } from '@pages/miles/models';
import { IStateFilters, ITableColumn } from '@shared/models';

@Component({
    selector: 'app-miles',
    standalone: true,
    imports: [
        CommonModule,

        // Components
        NewTableComponent,
        NewTableToolbarComponent,
        ToolbarTabsWrapperComponent,
        TaTruckTrailerIconComponent, 
        CaFilterComponent,
        CaSearchMultipleStatesComponent,
        CaFilterDropdownComponent,
        CaFilterStateDropdownComponent,
        CaFilterTimeDropdownComponent,
    ],
    templateUrl: './miles.component.html',
    styleUrls: ['./miles.component.scss'],
})
export class MilesComponent implements OnInit {
    private filter: IStateFilters = {};
    constructor(
        private store: Store<IMilesState>,
        public milesStoreService: MilesStoreService
    ) {}

    ngOnInit(): void {
        this.storeSubscription();
    }

    public onToolBarAction(event: { mode: eMileTabs; action: string }): void {
        const { action, mode } = event || {};
        if (action === TableStringEnum.TAB_SELECTED) {
            this.milesStoreService.listChange(mode);
        } else if (action === TableStringEnum.VIEW_MODE) {
            this.milesStoreService.dispatchSetActiveViewMode(
                eActiveViewMode[mode]
            );
        }
    }
 
    public setFilters(filters: IFilterAction): void {
        this.milesStoreService.dispatchFilters(filters, this.filter);
    }

    public selectRow(mile: IMilesModel) : void {
        this.milesStoreService.dispatchSelectOneRow(mile);
    }

    public selectAll() : void {
        this.milesStoreService.dispatchSelectAll();
    }

    private storeSubscription(): void {
        this.milesStoreService.filter$.subscribe(res =>this.filter = res);
    }
}
