import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// routes
import { LoadDetailsCardSvgRoutes } from '@pages/load/pages/load-details/components/load-details-card/utils/svg-routes/load-details-card-svg-routes';

// helpers
import { LoadDetailsCardHelper } from '@pages/load/pages/load-details/components/load-details-card/utils/helpers/load-details-card-helper';

// enums
import { LoadDetailsCardStringEnum } from '@pages/load/pages/load-details/components/load-details-card/enums/load-details-card-string.enum';

// models
import { LoadResponse } from 'appcoretruckassist';
import { CreatedData } from '@pages/load/pages/load-details/components/load-details-card/models/created-data.model';

@Component({
    selector: 'app-load-details-requirement-card',
    templateUrl: './load-details-requirement-card.component.html',
    styleUrls: ['./load-details-requirement-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaCustomCardComponent,
    ],
})
export class LoadDetailsRequirementCardComponent implements OnChanges {
    @Input() cardData: LoadResponse;

    public requirementDataArray: CreatedData[] = [];

    public loadDetailsCardSvgRoutes = LoadDetailsCardSvgRoutes;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.cardData?.currentValue) this.createLoadRequirementData();
    }

    public trackByIdentity = (index: number): number => index;

    private createLoadRequirementData(): void {
        const {
            truckType,
            trailerType,
            trailerLength,
            doorType,
            suspension,
            year,
            liftgate,
        } = this.cardData?.loadRequirements || {};
        const { generalCommodity, weight } = this.cardData;

        const requirementData = {
            commodity: generalCommodity?.name,
            weight: weight ? weight + LoadDetailsCardStringEnum.LBS : null,
            truckReq: truckType?.name,
            trailerReq: trailerType?.name,
            length: trailerLength?.name,
            doorType: doorType?.name,
            suspension: suspension?.name,
            year: year,
            liftgate: liftgate
                ? LoadDetailsCardStringEnum.YES
                : LoadDetailsCardStringEnum.NO,
        };

        const filteredRequirementData =
            LoadDetailsCardHelper.filterObjectProperties(requirementData);

        this.requirementDataArray = [];

        Object.entries(filteredRequirementData).map((reqData) => {
            const data = {
                title: LoadDetailsCardHelper.createRequirementProperties(
                    reqData[0]
                ),
                value: reqData[1] as number | string,
            };

            this.requirementDataArray.push(data);
        });
    }
}
