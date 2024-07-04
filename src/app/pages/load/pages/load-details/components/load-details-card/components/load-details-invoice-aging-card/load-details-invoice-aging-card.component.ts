import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// models
import { LoadResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-load-details-invoice-aging-card',
    templateUrl: './load-details-invoice-aging-card.component.html',
    styleUrls: ['./load-details-invoice-aging-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,

        // pipes
        FormatDatePipe,
    ],
})
export class LoadDetailsInvoiceAgingCardComponent {
    @Input() cardData: LoadResponse;

    constructor() {}
}
