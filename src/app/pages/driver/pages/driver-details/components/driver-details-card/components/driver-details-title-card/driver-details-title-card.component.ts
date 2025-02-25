import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// enums
import { eGeneralActions, eStringPlaceholder } from '@shared/enums';

// models
import { DriverMinimalResponse, DriverResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-driver-details-title-card',
    templateUrl: './driver-details-title-card.component.html',
    styleUrls: ['./driver-details-title-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaDetailsHeaderCardComponent,
        TaProfileImagesComponent,
        TaAppTooltipV2Component,
        TaCopyComponent,

        // pipes
        FormatDatePipe,
    ],
})
export class DriverDetailsTitleCardComponent {
    @Input() driverCurrentIndex: number;
    @Input() driversDropdownList: DriverMinimalResponse[];
    @Input() cardData: DriverResponse;

    @Output() cardValuesEmitter = new EventEmitter<{
        event: DriverMinimalResponse;
        type: string;
    }>();

    // enums
    public eGeneralActions = eGeneralActions;
    public eStringPlaceholder = eStringPlaceholder;

    constructor() {}

    public handleCardChanges(event: DriverMinimalResponse, type: string): void {
        this.cardValuesEmitter.emit({ event, type });
    }
}
