import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

@Component({
    selector: 'app-load-details-general',
    templateUrl: './load-details-general.component.html',
    styleUrl: './load-details-general.component.scss',
    standalone: true,
    imports: [CommonModule],
})
export class LoadDetailsGeneralComponent {
    constructor(protected loadStoreService: LoadStoreService) {}
}
