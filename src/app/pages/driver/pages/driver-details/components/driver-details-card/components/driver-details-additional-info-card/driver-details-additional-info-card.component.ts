import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// enums
import { DriverDetailsCardStringEnum } from '@pages/driver/pages/driver-details/components/driver-details-card/enums/driver-details-card-string.enum';

// models
import { DriverResponse } from 'appcoretruckassist';
import { AdditionalInfoItem } from '@pages/driver/pages/driver-details/components/driver-details-card/models/additional-info-item.model';

@Component({
    selector: 'app-driver-details-additional-info-card',
    templateUrl: './driver-details-additional-info-card.component.html',
    styleUrls: ['./driver-details-additional-info-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
    ],
})
export class DriverDetailsAdditionalInfoCardComponent implements OnChanges {
    @Input() cardData: DriverResponse;

    public additionalInfo: AdditionalInfoItem[];

    constructor() {}

    ngOnChanges(): void {
        this.createAdditionalInfo();
    }

    private createAdditionalInfo(): void {
        this.additionalInfo = [
            {
                title: DriverDetailsCardStringEnum.DOB,
                content: MethodsCalculationsHelper.convertDateFromBackend(
                    this.cardData.dateOfBirth
                ),
            },
            {
                title: DriverDetailsCardStringEnum.FUEL_CARD,
                content: this.cardData.fuelCards.length
                    ? this.cardData.fuelCards[
                          this.cardData.fuelCards.length - 1
                      ]
                    : DriverDetailsCardStringEnum.SLASH,
            },
            {
                title: DriverDetailsCardStringEnum.TWIC_EXP,
                content: this.cardData.twicExpDate
                    ? MethodsCalculationsHelper.convertDateFromBackend(
                          this.cardData.twicExpDate
                      )
                    : DriverDetailsCardStringEnum.SLASH,
            },
            {
                title: DriverDetailsCardStringEnum.MVR_EXP,
                content:
                    this.cardData.mvrExpiration +
                    DriverDetailsCardStringEnum.MONTHS,
            },
        ];
    }
}
