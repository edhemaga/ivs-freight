import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// enums
import { LoadDetailsCardStringEnum } from '@pages/load/pages/load-details/components/load-details-card/enums/load-details-card-string.enum';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// models
import { LoadResponse } from 'appcoretruckassist';
import { CreatedData } from '@pages/load/pages/load-details/components/load-details-card/models/created-data.model';

@Component({
    selector: 'app-load-details-payment-card',
    templateUrl: './load-details-payment-card.component.html',
    styleUrls: ['./load-details-payment-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
    ],
})
export class LoadDetailsPaymentCardComponent implements OnChanges {
    @Input() cardData: LoadResponse;

    public isPaymentCardOpen: boolean = true;

    public paymentDataArray: CreatedData[] = [];

    public paymentCount: number = 0;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.cardData?.currentValue) this.createPaymentData();
    }

    public trackByIdentity = (index: number): number => index;

    public handlePaymentCardOpen(isOpen: boolean): void {
        this.isPaymentCardOpen = isOpen;
    }

    private createPaymentData(): void {
        const advanceRate = {
            title: LoadDetailsCardStringEnum.ADVANCE,
            value: this.cardData.advancePay,
        };

        const total = {
            title: this.cardData.totalDue
                ? LoadDetailsCardStringEnum.DUE
                : LoadDetailsCardStringEnum.PAID_IN_FULL,
            value: this.cardData.totalDue || this.cardData.totalPaid,
        };

        this.paymentDataArray = [];

        if (this.cardData.advancePay) this.paymentDataArray = [advanceRate];

        this.cardData.pays?.forEach((paymentRate) => {
            const rate = {
                title: paymentRate.paymentMethod.name,
                subTitle: paymentRate.paymentType.name,
                date: paymentRate.payDate
                    ? MethodsCalculationsHelper.convertDateFromBackend(
                          paymentRate.payDate
                      )
                    : null,
                value: paymentRate.pay,
            };

            this.paymentDataArray = [...this.paymentDataArray, rate];
        });

        this.paymentDataArray = [...this.paymentDataArray, total];

        // payment count
        this.paymentCount = this.paymentDataArray.length - 1;
    }
}
