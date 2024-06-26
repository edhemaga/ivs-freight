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

    public billingCount: number = 0;

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

        let totalAdjusted: CreatedData;

        this.billingDataArray = [];
        this.billingDataArray = [baseRate];

        // commission
        if (this.cardData.adjustedRate) {
            const adjustedRate = {
                title: LoadDetailsCardStringEnum.ADJUSTED,
                value: this.cardData.adjustedRate,
            };

            totalAdjusted = {
                title: LoadDetailsCardStringEnum.TOTAL_ADJUSTED,
                value: this.cardData.totalAdjustedRate,
            };

            this.billingDataArray = [...this.billingDataArray, adjustedRate];
        }

        // flat rate
        if (this.cardData.driverRate) {
            const driverRate = {
                title: LoadDetailsCardStringEnum.DRIVER_RATE,
                value: this.cardData.driverRate,
            };

            this.billingDataArray = [...this.billingDataArray, driverRate];
        }

        this.cardData.additionalBillingRates
            ?.filter(({ rate }) => rate > 0)
            .forEach((billingRate) => {
                const rate = {
                    title: billingRate.additionalBillingType.name,
                    value: billingRate.rate,
                };

                this.billingDataArray = [...this.billingDataArray, rate];
            });

        this.billingDataArray = [...this.billingDataArray, totalRate];

        // commission
        if (this.cardData.adjustedRate)
            this.billingDataArray = [...this.billingDataArray, totalAdjusted];

        // tonu rate
        if (this.cardData.tonuRate) {
            const tonuRate = {
                title: LoadDetailsCardStringEnum.TONU_RATE,
                value: this.cardData.tonuRate,
            };

            this.billingDataArray = [...this.billingDataArray, tonuRate];
        }

        // billing count
        this.billingCount =
            this.billingDataArray.length - (this.cardData.adjustedRate ? 2 : 1);
    }
}
