import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// svg routes
import { RepairShopDetailsSvgRoutes } from '@pages/repair/pages/repair-shop-details/utils/svg-routes';

// helpers
import { OpenHoursHelper } from '@shared/utils/helpers';

// models
import { RepairShopResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-repair-shop-details-open-hours-card',
    templateUrl: './repair-shop-details-open-hours-card.component.html',
    styleUrls: ['./repair-shop-details-open-hours-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        TaCustomCardComponent,
    ],
})
export class RepairShopDetailsOpenHoursCardComponent {
    @Input() set cardData(data: RepairShopResponse) {
        this.createOpenHoursCardData(data);
    }

    public _cardData: RepairShopResponse;

    public isOpenHoursCardOpen: boolean = true;

    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;

    public handleOpenHoursCardOpen(isOpen: boolean): void {
        this.isOpenHoursCardOpen = isOpen;
    }

    private createOpenHoursCardData(data: RepairShopResponse): void {
        const openHours = OpenHoursHelper.createOpenHours(data?.openHours);

        this._cardData = {
            ...data,
            openHours,
        };
    }
}
