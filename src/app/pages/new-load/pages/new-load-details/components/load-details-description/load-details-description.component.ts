import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

@Component({
    selector: 'app-load-details-description',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './load-details-description.component.html',
    styleUrl: './load-details-description.component.scss',
})
export class LoadDetailsDescriptionComponent {
    constructor(protected loadStoreService: LoadStoreService) {}
}
