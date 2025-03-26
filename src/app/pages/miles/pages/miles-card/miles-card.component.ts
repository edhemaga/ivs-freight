import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// components
import { TableCardViewComponent } from '@shared/components/table-card-view/table-card-view.component';

@Component({
    selector: 'app-miles-card',
    templateUrl: './miles-card.component.html',
    styleUrl: './miles-card.component.scss',
    standalone: true,
    imports: [CommonModule, TableCardViewComponent],
})
export class MilesCardComponent {
    constructor(public milesStoreService: MilesStoreService) {}
}
