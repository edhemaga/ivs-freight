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
} from '@pages/miles/state/selectors/miles.selectors';

// Shared Components
import { ToolbarTabsWrapperComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs-wrapper/toolbar-tabs-wrapper.component';
import { NewTableToolbarComponent } from '@shared/components/new-table-toolbar/new-table-toolbar.component';
import {
    CaFilterComponent,
    CaSearchMultipleStatesComponent,
    CaFilterDropdownComponent,
    IFilterAction,
} from 'ca-components';

// Feature Services
import { MilesStoreService } from './state/services/miles-store.service';

// Enums
import { eMileTabs } from '@pages/miles/enums';
import { TableStringEnum } from '@shared/enums';
import { eActiveViewMode } from '@pages/load/pages/load-table/enums';

// Models
import { MilesByUnitResponse, MilesStateFilterResponse } from 'appcoretruckassist';
import { IMilesModel, IMilesState } from '@pages/miles/models';
import { IStateFilters, ITableColumn } from '@shared/models';
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { TaTruckTrailerIconComponent } from '@shared/components/ta-truck-trailer-icon/ta-truck-trailer-icon.component';

@Component({
    selector: 'app-miles',
    standalone: true,
    imports: [
        CommonModule,
        NewTableComponent,
        NewTableToolbarComponent,
        ToolbarTabsWrapperComponent,
        TaTruckTrailerIconComponent,

        CaFilterComponent,
        CaSearchMultipleStatesComponent,
        CaFilterDropdownComponent,
    ],
    templateUrl: './miles.component.html',
    styleUrls: ['./miles.component.scss'],
})
export class MilesComponent implements OnInit {
    public tableViewData$: Observable<any[]>;
    public selectedTabData$: Observable<any>;
    public miles$: Observable<IMilesModel[]>;
    public selectedTab$: Observable<eMileTabs>;
    public activeViewMode$: Observable<string>;
    private filter: IStateFilters = {};
    public statesSelector$: Observable<MilesStateFilterResponse[]>;
    public selectedRowsSelector$: Observable<number>;
    public columns$: Observable<ITableColumn[]>;
    constructor(
        private store: Store<IMilesState>,
        private milesStoreService: MilesStoreService
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

    private storeSubscription(): void {
        this.miles$ = this.store.select(selectMilesItems);
        this.activeViewMode$ = this.store.select(activeViewModeSelector);
        this.tableViewData$ = this.store.select(selectTableViewData);
        this.selectedTab$ = this.store.select(selectSelectedTab); 
        this.statesSelector$ = this.store.select(statesSelector); 
        this.selectedRowsSelector$ = this.store.select(selectedRowsSelector);
        this.columns$ = this.store.select(tableColumnsSelector);
        // TODO: Maybe this is not good, check
        this.store.select(filterSelector).subscribe(res =>this.filter = res);
    }

    public setFilters(filters: IFilterAction): void {
        this.milesStoreService.dispatchFilters(filters, this.filter);
    }

    public selectRow(mile: IMilesModel) : void {
        this.milesStoreService.dispatchSelectOneRow(mile);
    }
}
