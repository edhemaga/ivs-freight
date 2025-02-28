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
import { MilesByUnitResponse } from 'appcoretruckassist';
import { IMilesState } from '@pages/miles/models';
import { IStateFilters } from '@shared/models';

@Component({
    selector: 'app-miles',
    standalone: true,
    imports: [
        CommonModule,
        NewTableToolbarComponent,
        ToolbarTabsWrapperComponent,

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
    public miles$: Observable<MilesByUnitResponse[]>;
    public selectedTab$: Observable<eMileTabs>;
    public activeViewMode$: Observable<string>;
    private filter: IStateFilters = {};
    private selectedTab: eMileTabs;
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
        this.selectedTab$.subscribe(val => this.selectedTab = val) 
    }

    public setFilters(filters: IFilterAction): void {
        this.milesStoreService.dispatchFilters(filters, this.filter, this.selectedTab);
    }
}
