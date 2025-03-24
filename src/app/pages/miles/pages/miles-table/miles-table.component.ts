import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// interfaces
import { IMilesModel } from '@pages/miles/interface';

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';
import { TaTruckTrailerIconComponent } from '@shared/components/ta-truck-trailer-icon/ta-truck-trailer-icon.component';
import { ThousandSeparatorPipe } from '@shared/pipes';
import { CaCheckboxComponent } from 'ca-components';

// pipes

@Component({
    selector: 'app-miles-table',
    templateUrl: './miles-table.component.html',
    styleUrl: './miles-table.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        NewTableComponent,
        TaTruckTrailerIconComponent,
        CaCheckboxComponent,

        // pipes
        ThousandSeparatorPipe,
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
}
