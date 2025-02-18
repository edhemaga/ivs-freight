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
    @Input() set cardData(data: RepairShopResponse) {} // w8ing for back

    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;

    public _cardData /* : RepairShopResponse[]  */ = [
        // dummy w8ing for back
        {
            workingDays: 'Monday - Friday',
            workingHours: '8:00 AM - 10:00 PM',
        },
        {
            workingDays: 'Saturday',
            workingHours: '10:00 AM - 4:00 PM',
        },
        {
            workingDays: 'Sunday',
            workingHours: '8:00 AM - 2:00 PM',
        },
    ];

    public isOpenHoursCardOpen: boolean = true;

    public handleOpenHoursCardOpen(isOpen: boolean): void {
        this.isOpenHoursCardOpen = isOpen;
    }
}
