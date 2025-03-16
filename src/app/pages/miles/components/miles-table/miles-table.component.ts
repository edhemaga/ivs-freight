import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Interface
import { IMilesModel } from '@pages/miles/interface';

// Services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// Components
import { NewTableComponent } from '@shared/components/new-table/new-table.component';

@Component({
    selector: 'app-miles-table',
    standalone: true,
    imports: [CommonModule, NewTableComponent],
    templateUrl: './miles-table.component.html',
    styleUrl: './miles-table.component.scss',
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
