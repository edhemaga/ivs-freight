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
    eSharedString,
    TableStringEnum,
} from '@shared/enums';

// Interfaces
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
        CaSearchMultipleStatesComponent,
        CaFilterStateDropdownComponent,
        CaFilterTimeDropdownComponent,
        MilesMapComponent,
        MilesCardComponent,
        MilesTableComponent,
    ],
})
export class MilesComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    private filter: IStateFilters = {};

    // enums
    public eSharedString = eSharedString;
    public eActiveViewMode = eActiveViewMode;
    public eCommonElement = eCommonElement;

    constructor(public milesStoreService: MilesStoreService) {}

    ngOnInit(): void {
        this.storeSubscription();
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

    private storeSubscription(): void {
        this.milesStoreService.filter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => (this.filter = res));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
