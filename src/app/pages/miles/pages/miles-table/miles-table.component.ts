import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

// interfaces
import {
    ITableColumn,
    ITableReorderAction,
    ITableResizeAction,
} from '@shared/components/new-table/interfaces';

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// enums
import { eMileTabs } from '@pages/miles/enums';
import { eColor, ePosition, eUnit } from 'ca-components';
import { eDateTimeFormat, eThousandSeparatorFormat } from '@shared/enums';

// components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { TaTruckTrailerIconComponent } from '@shared/components/ta-truck-trailer-icon/ta-truck-trailer-icon.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// pipes
import { TableHighlightSearchTextPipe } from '@shared/components/new-table/pipes';

@Component({
    selector: 'app-miles-table',
    templateUrl: './miles-table.component.html',
    styleUrl: './miles-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        NgbTooltip,

        // components
        NewTableComponent,
        TaTruckTrailerIconComponent,
        TaAppTooltipV2Component,

        // pipes
        TableHighlightSearchTextPipe,
    ],
})
export class MilesTableComponent {
    public eMileTabs = eMileTabs;
    public eUnit = eUnit;
    public eColor = eColor;
    public ePosition = ePosition;
    public eThousandSeparatorFormat = eThousandSeparatorFormat;
    public eDateTimeFormat = eDateTimeFormat;

    constructor(public milesStoreService: MilesStoreService) {}

    public onColumnSort(column: ITableColumn): void {
        this.milesStoreService.dispatchSortingChange(column);
    }

    public onColumnPin(column: ITableColumn): void {
        this.milesStoreService.dispatchColumnPinnedAction(column);
    }

    public onColumnRemove(columnKey: string): void {
        this.milesStoreService.dispatchToggleColumnsVisibility(
            columnKey,
            false
        );
    }

    public onColumnResize(resizeAction: ITableResizeAction): void {
        this.milesStoreService.dispatchResizeColumn(resizeAction);
    }

    public onColumnReorder(reorderAction: ITableReorderAction): void {
        this.milesStoreService.dispatchReorderColumn(reorderAction);
    }

    public onShowMoreClick(): void {
        this.milesStoreService.getNewPage();
    }

    public navigateToMilesDetails(id: string): void {
        this.milesStoreService.navigateToMilesDetails(id);
    }
}
