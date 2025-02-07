import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// svg routes
import { RepairShopDetailsSvgRoutes } from '@pages/repair/pages/repair-shop-details/utils/svg-routes';

// models
import { RepairShopResponse } from 'appcoretruckassist';
import { ExtendedRepairShopResponse } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/models';

@Component({
    selector: 'app-repair-shop-details-services-card',
    templateUrl: './repair-shop-details-services-card.component.html',
    styleUrls: ['./repair-shop-details-services-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaCustomCardComponent,
    ],
})
export class RepairShopDetailsServicesCardComponent {
    @Input() set cardData(data: RepairShopResponse) {
        this.createServicesCardData(data);
    }

    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;

    public _cardData: ExtendedRepairShopResponse;

    private createServicesCardData(data: RepairShopResponse): void {
        this._cardData = data;

        const activeServicesCount = this._cardData?.serviceTypes?.filter(
            (service) => service.active
        ).length;

        this._cardData = {
            ...this._cardData,
            activeServicesCount,
        };
    }
}
