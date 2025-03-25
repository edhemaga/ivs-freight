import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Interfaces
import { IMilesModel } from '@pages/miles/interface';

// Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// Components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { TaTruckTrailerIconComponent } from '@shared/components/ta-truck-trailer-icon/ta-truck-trailer-icon.component';
import { ITableColumn } from '@shared/models';
import { CaCheckboxComponent } from 'ca-components';

@Component({
    selector: 'app-miles-table',
    templateUrl: './miles-table.component.html',
    styleUrl: './miles-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,

        // Components
        NewTableComponent,
        TaTruckTrailerIconComponent,
        CaCheckboxComponent,
    ],
})
export class MilesTableComponent {
    constructor(public milesStoreService: MilesStoreService) {}

    public selectRow(mile: IMilesModel): void {
        this.milesStoreService.dispatchSelectOneRow(mile);
    }

    public selectAll(): void {
        this.milesStoreService.dispatchSelectAll();
    }

    public onColumnPinned(column: ITableColumn): void {
        this.milesStoreService.dispatchColumnPinnedAction(column);
    }
}
