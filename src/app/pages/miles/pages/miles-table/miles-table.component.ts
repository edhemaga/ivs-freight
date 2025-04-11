import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// interfaces
import {
    ITableColumn,
    ITableResizeAction,
} from '@shared/components/new-table/interface';

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// enums
import { eMileTabs } from '@pages/miles/enums';
import { eUnit } from 'ca-components';

// components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { TaTruckTrailerIconComponent } from '@shared/components/ta-truck-trailer-icon/ta-truck-trailer-icon.component';

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

        // pipes
        ThousandSeparatorPipe,
    ],
})
export class MilesTableComponent {
    public eMileTabs = eMileTabs;
    public eUnit = eUnit;

    constructor(public milesStoreService: MilesStoreService) {}

    public onColumnPinned(column: ITableColumn): void {
        this.milesStoreService.dispatchColumnPinnedAction(column);
    }

    public onSortingChange(column: ITableColumn): void {
        this.milesStoreService.dispatchSortingChange(column);
    }

    public onHandleShowMoreClick(): void {
        this.milesStoreService.getNewPage();
    }

    public onColumnResize(resizeAction: ITableResizeAction): void {
        this.milesStoreService.dispatchResizeColumn(resizeAction);
    }

    public onRemoveColumn(columnKey: string): void {
        this.milesStoreService.dispatchToggleColumnsVisiblity(columnKey, false);
    }
}
