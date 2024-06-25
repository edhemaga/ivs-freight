import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// enums
import { LoadDetailsCardStringEnum } from '@pages/load/pages/load-details/components/load-details-card/enums/load-details-card-string.enum';

// models
import { LoadResponse } from 'appcoretruckassist';
import { CreatedData } from '@pages/load/pages/load-details/components/load-details-card/models/created-data.model';

@Component({
    selector: 'app-load-details-billing-card',
    templateUrl: './load-details-billing-card.component.html',
    styleUrls: ['./load-details-billing-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
    ],
})
export class LoadDetailsBillingCardComponent implements OnChanges {
    @Input() cardData: LoadResponse;

    public isBillingCardOpen: boolean = true;

    public billingDataArray: CreatedData[] = [];

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.cardData?.currentValue) this.createBillingData();
    }

    public trackByIdentity = (index: number): number => index;

    public handleBillingCardOpen(isOpen: boolean): void {
        this.isBillingCardOpen = isOpen;
    }

    private createBillingData(): void {
        const baseRate = {
            title: LoadDetailsCardStringEnum.BASE_RATE,
            value: this.cardData.baseRate,
        };

        const totalRate = {
            title: LoadDetailsCardStringEnum.TOTAL_RATE,
            value: this.cardData.totalRate,
        };

        this.billingDataArray = [];
        this.billingDataArray = [baseRate];

        this.cardData.additionalBillingRates?.forEach((billingRate) => {
            const rate = {
                title: billingRate.additionalBillingType.name,
                value: billingRate.rate,
            };

            this.billingDataArray = [...this.billingDataArray, rate];
        });

        this.billingDataArray = [...this.billingDataArray, totalRate];
    }
}
