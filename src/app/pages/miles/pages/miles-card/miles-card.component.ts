import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// services
import { MilesStoreService } from '@pages/miles/state/services/miles-store.service';

// components
import { CaTableCardViewComponent } from 'ca-components';

@Component({
    selector: 'app-miles-card',
    templateUrl: './miles-card.component.html',
    styleUrl: './miles-card.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        
        // components
        CaTableCardViewComponent,
    ],
})
export class MilesCardComponent {
    constructor(public milesStoreService: MilesStoreService) {}
}
