import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

// interfaces
import {
    ITableColumn,
    ITableResizeAction,
} from '@shared/components/new-table/interface';

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// enums
import { eMileTabs } from '@pages/miles/enums';
import { eColor, ePosition, eUnit } from 'ca-components';

// components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { TaTruckTrailerIconComponent } from '@shared/components/ta-truck-trailer-icon/ta-truck-trailer-icon.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes';
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
        ThousandSeparatorPipe,
        TableHighlightSearchTextPipe,
    ],
})
export class MilesTableComponent {
    public eMileTabs = eMileTabs;
    public eUnit = eUnit;
    public eColor = eColor;
    public ePosition = ePosition;

    constructor(public milesStoreService: MilesStoreService) {}

    public onColumnPinned(column: ITableColumn): void {
        this.milesStoreService.dispatchColumnPinnedAction(column);
    }

    public onSortingChange(column: ITableColumn): void {
        this.milesStoreService.dispatchSortingChange(column);
    }

    public onShowMoreClick(): void {
        this.milesStoreService.getNewPage();
    }

    public onColumnResize(resizeAction: ITableResizeAction): void {
        this.milesStoreService.dispatchResizeColumn(resizeAction);
    }

    public goToMilesDetailsPage(id: string): void {
        this.milesStoreService.goToMilesDetailsPage(id);
    }

    public onRemoveColumn(columnKey: string): void {
        this.milesStoreService.dispatchToggleColumnsVisiblity(columnKey, false);
    }
}
