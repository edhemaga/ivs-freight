import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Components
import { CaCheckboxComponent } from 'ca-components';

@Component({
    selector: 'app-new-load-table',
    templateUrl: './new-load-table.component.html',
    styleUrl: './new-load-table.component.scss',
    standalone: true,
    imports: [CommonModule, RouterLink, CaCheckboxComponent],
})
export class NewLoadTableComponent {
    constructor(protected loadStoreService: LoadStoreService) {}

    public selectRow(load: any): void {
        this.loadStoreService.dispatchSelectOneRow(load);
    }

    public selectAll(): void {
        this.loadStoreService.dispatchSelectAll();
    }
}
