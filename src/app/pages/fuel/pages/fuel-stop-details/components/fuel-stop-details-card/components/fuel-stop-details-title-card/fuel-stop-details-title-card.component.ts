import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// pipes
import { FormatDatePipe } from '@shared/pipes';

// svg routes
import { FuelStopDetailsSvgRoutes } from '@pages/fuel/pages/fuel-stop-details/utils/svg-routes';

// enums
import {
    eBusinessStatus,
    eGeneralActions,
    eStringPlaceholder,
} from '@shared/enums';
import { eFuelStopDetails } from '@pages/fuel/pages/fuel-stop-details/enums';

// interfaces
import { IAdditionalChangeEvent } from '@shared/components/ta-details-header-card/interfaces/additional-change-event.interface';

// models
import { FuelStopMinimalResponse, FuelStopResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-fuel-stop-details-title-card',
    templateUrl: './fuel-stop-details-title-card.component.html',
    styleUrl: './fuel-stop-details-title-card.component.scss',
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
export class FuelStopDetailsTitleCardComponent {
    @Input() set cardData(data: FuelStopResponse) {
        this._cardData = data;
    }

    @Input() fuelStopCurrentIndex: number;
    @Input() fuelStopStoreCurrentIndex: number;
    @Input() fuelStopFranchiseDropdownList: FuelStopMinimalResponse[];
    @Input() fuelStopStoreDropdownList: FuelStopMinimalResponse[];

    @Output() cardValuesEmitter = new EventEmitter<{
        event: IAdditionalChangeEvent | string;
        type: string;
        isAdditionalDropdownAction?: boolean;
    }>();
    @Output() cardValuesAdditionalEmitter = new EventEmitter<{
        event: IAdditionalChangeEvent | string;
        type: string;
    }>();

    public _cardData: FuelStopResponse;

    // svg routes
    public fuelStopDetailsSvgRoutes = FuelStopDetailsSvgRoutes;

    // enums
    public eGeneralActions = eGeneralActions;
    public eStringPlaceholder = eStringPlaceholder;
    public eFuelStopDetails = eFuelStopDetails;
    public eBusinessStatus = eBusinessStatus;

    constructor() {}

    public handleCardChanges(
        event: IAdditionalChangeEvent | string,
        type: string,
        isAdditionalDropdownChange: boolean = false
    ): void {
        const payload = isAdditionalDropdownChange
            ? {
                  event: (event as IAdditionalChangeEvent).action,
                  type,
                  isAdditionalDropdownAction: (event as IAdditionalChangeEvent)
                      .isAdditionalDropdownAction,
              }
            : { event, type };

        this.cardValuesEmitter.emit(payload);
    }
}
