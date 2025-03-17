// External Libraries
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

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
    CaFilterTimeDropdownComponent,
} from 'ca-components';
import { MilesMapComponent } from '@pages/miles/components/miles-map/miles-map.component';
import { MilesCardComponent } from '@pages/miles/components/miles-card/miles-card.component';
import { MilesTableComponent } from '@pages/miles/components/miles-table/miles-table.component';

// Feature Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// Enums
import { eMileTabs } from '@pages/miles/enums';
import { TableStringEnum } from '@shared/enums';
import { eActiveViewMode } from '@shared/enums';

// Interface
import { IMilesModel } from '@pages/miles/interface';
import { IStateFilters } from '@shared/interfaces';

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
        MilesMapComponent,
        MilesCardComponent,
        MilesTableComponent,
    ],
    templateUrl: './miles.component.html',
    styleUrls: ['./miles.component.scss'],
})
export class MilesComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private filter: IStateFilters = {};

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
