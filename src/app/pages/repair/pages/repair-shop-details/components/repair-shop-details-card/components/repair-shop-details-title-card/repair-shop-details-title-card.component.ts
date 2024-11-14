import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// svg routes
import { RepairShopDetailsSvgRoutes } from '@pages/repair/pages/repair-shop-details/utils/svg-routes';

// pipes
import { FormatDatePipe } from '@shared/pipes';

// models
import {
    RepairShopListDto,
    RepairShopMinimalResponse,
    RepairShopResponse,
} from 'appcoretruckassist';

@Component({
    selector: 'app-repair-shop-details-title-card',
    templateUrl: './repair-shop-details-title-card.component.html',
    styleUrls: ['./repair-shop-details-title-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaDetailsHeaderCardComponent,
        TaCopyComponent,
        TaAppTooltipV2Component,

        // pipes
        FormatDatePipe,
    ],
})
export class RepairShopDetailsTitleCardComponent {
    @Input() set cardData(data: RepairShopListDto) {
        this._cardData = data;
    }

    @Input() repairShopCurrentIndex: number;
    @Input() repairShopDropdownList: RepairShopResponse[];

    @Output() cardValuesEmitter = new EventEmitter<{
        event: RepairShopMinimalResponse;
        type: string;
    }>();

    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;

    public _cardData: RepairShopListDto;

    public handleCardChanges(
        event: RepairShopMinimalResponse,
        type: string
    ): void {
        this.cardValuesEmitter.emit({ event, type });
    }
}
