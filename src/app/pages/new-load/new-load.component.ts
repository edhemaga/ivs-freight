import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

@Component({
    selector: 'app-new-load',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './new-load.component.html',
    styleUrl: './new-load.component.scss',
})
export class NewLoadComponent {
    constructor(protected loadStoreService: LoadStoreService) {}
}
