import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    selectTableViewData,
    selectSelectedTab,
    selectMilesItems,
    activeViewModeSelector,
} from '@pages/miles/state/selectors/miles.selectors';
import { MilesState } from './state/reducers/miles.reducer';
import { CommonModule } from '@angular/common';
import { ToolbarTabsWrapperComponent } from '@shared/components/new-table-toolbar/components/toolbar-tabs-wrapper/toolbar-tabs-wrapper.component';
import { NewTableToolbarComponent } from '@shared/components/new-table-toolbar/new-table-toolbar.component';
import { MilesByUnitResponse } from 'appcoretruckassist';
import { MilesStoreService } from './state/services/miles-store.service';
import { eMileTabs } from './enums';
import { eActiveViewMode } from '@pages/load/pages/load-table/enums';
import { TableStringEnum } from '@shared/enums';

@Component({
    selector: 'app-miles',
    standalone: true,
    imports: [
        CommonModule,
        NewTableToolbarComponent,
        ToolbarTabsWrapperComponent,
    ],
    templateUrl: './miles.component.html',
    styleUrls: ['./miles.component.scss'],
})
export class MilesComponent implements OnInit {
    public tableViewData$: Observable<any[]>;
    public selectedTabData$: Observable<any>;
    public miles$: Observable<MilesByUnitResponse[]>;
    public selectedTab$: Observable<eMileTabs>;
    public activeViewMode$: Observable<string>
    constructor(
        private store: Store<MilesState>,
        private milesStoreService: MilesStoreService
    ) {}

    ngOnInit(): void {
        this.storeSubscription();
    }

    public onToolBarAction(event: {mode: eMileTabs, action: string}): void {
        const { action, mode } = event || {};
       if (action === TableStringEnum.TAB_SELECTED) {
           this.milesStoreService.listChange(mode);
       }  else if (action === TableStringEnum.VIEW_MODE) {
       
    }
    }

    private storeSubscription(): void {
        this.miles$ = this.store.select(selectMilesItems);
        this.activeViewMode$ = this.store.select(activeViewModeSelector);
        this.tableViewData$ = this.store.select(selectTableViewData);
        this.selectedTab$ = this.store.select(selectSelectedTab);
    }
}
