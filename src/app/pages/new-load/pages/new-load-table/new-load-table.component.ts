import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

@Component({
    selector: 'app-new-load-table',
    templateUrl: './new-load-table.component.html',
    styleUrl: './new-load-table.component.scss',
    standalone: true,
    imports: [CommonModule, RouterLink],
})
export class NewLoadTableComponent {
    constructor(protected loadStoreService: LoadStoreService) {}
}
