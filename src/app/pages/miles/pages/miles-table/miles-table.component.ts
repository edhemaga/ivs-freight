import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// interfaces
import { IMilesModel } from '@pages/miles/interface';
import { ITableColumn } from '@shared/components/new-table/interface';

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// enums
import { eGeneralActions } from '@shared/enums';
import { eMileTabs } from '@pages/miles/enums';

// components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { TaTruckTrailerIconComponent } from '@shared/components/ta-truck-trailer-icon/ta-truck-trailer-icon.component';
import {
    CaCheckboxComponent,
    CaCheckboxSelectedCountComponent,
} from 'ca-components';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes';

@Component({
    selector: 'app-miles-table',
    templateUrl: './miles-table.component.html',
    styleUrl: './miles-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,

        // components
        NewTableComponent,
        TaTruckTrailerIconComponent,
        CaCheckboxComponent,
        CaCheckboxSelectedCountComponent,

        // pipes
        ThousandSeparatorPipe,
    ],
})
export class MilesTableComponent {
    public eMileTabs = eMileTabs;

    constructor(public milesStoreService: MilesStoreService) {}

    public selectRow(mile: IMilesModel): void {
        this.milesStoreService.dispatchSelectOneRow(mile);
    }

    public onColumnPinned(column: ITableColumn): void {
        this.milesStoreService.dispatchColumnPinnedAction(column);
    }

    public onSortingChange(column: ITableColumn): void {
        this.milesStoreService.dispatchSortingChange(column);
    }

    public onHandleShowMoreClick(): void {
        this.milesStoreService.getNewPage();
    }

    public onCheckboxCountClick(action: string): void {
        switch (action) {
            case eGeneralActions.SELECT_ALL:
            case eGeneralActions.CLEAR_SELECTED:
                this.milesStoreService.dispatchSelectAll();

                break;
            default:
                // select remaining
                break;
        }
    }
}
