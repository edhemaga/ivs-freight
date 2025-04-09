import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Models
import {
    ILoadGridItem,
    ILoadTemplateGridItem,
} from '@pages/load/pages/load-table/models';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Enums
import { eColor } from '@shared/enums';

// Components
import {
    CaCheckboxComponent,
    CaProfileImageComponent,
    CaLoadStatusComponent,
} from 'ca-components';
import { NewTableComponent } from '@shared/components/new-table/new-table.component';

// Pipes
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

@Component({
    selector: 'app-new-load-table',
    templateUrl: './new-load-table.component.html',
    styleUrl: './new-load-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,

        // Components
        NewTableComponent,
        CaProfileImageComponent,
        CaCheckboxComponent,
        CaLoadStatusComponent,

        // Pipes
        NameInitialsPipe,
    ],
})
export class NewLoadTableComponent {
    public eColor = eColor;

    constructor(protected loadStoreService: LoadStoreService) {}

    public selectLoad(load: ILoadGridItem | ILoadTemplateGridItem): void {
        this.loadStoreService.dispatchSelectOneRow(load);
    }

    public selectAll(): void {
        this.loadStoreService.dispatchSelectAll();
    }

    public navigateToLoadDetails(id: number): void {
        this.loadStoreService.navigateToLoadDetails(id);
    }

    public openLoadModal(id: number, isTemplate: boolean): void {
        this.loadStoreService.openLoadModal(id, isTemplate);
    }
}
