import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';

// Enums
import { eColor } from '@shared/enums';

// Components
import { CaLoadStatusComponent } from 'ca-components';
import { NewTableComponent } from '@shared/components/new-table/new-table.component';

@Component({
    selector: 'app-new-load-table',
    templateUrl: './new-load-table.component.html',
    styleUrl: './new-load-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        // Components
        NewTableComponent,
        CaLoadStatusComponent,
    ],
})
export class NewLoadTableComponent {
    public eColor = eColor;

    constructor(protected loadStoreService: LoadStoreService) {}

    public navigateToLoadDetails(id: number): void {
        this.loadStoreService.navigateToLoadDetails(id);
    }

    public onOpenModal(id: number, isTemplate: boolean): void {
        this.loadStoreService.onOpenModal({
            id,
            isTemplate,
            isEdit: true,
        });
    }
}
