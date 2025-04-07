import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Enums
import { eSharedString } from '@shared/enums';

// Components
import { CaLoadStatusLogComponent } from 'ca-components';

@Component({
    selector: 'app-load-details-additional',
    templateUrl: './load-details-additional.component.html',
    styleUrl: './load-details-additional.component.scss',
    standalone: true,
    imports: [
        // Modules
        CommonModule,

        // Components
        CaLoadStatusLogComponent],
})
export class LoadDetailsAdditionalComponent {
    public eSharedString = eSharedString;

    public statusLogSortDirection = eSharedString.DSC;

    constructor(protected loadStoreService: LoadStoreService) {}

    onSortChange(sortDirection: eSharedString) {
        this.statusLogSortDirection = sortDirection;
    }
}
