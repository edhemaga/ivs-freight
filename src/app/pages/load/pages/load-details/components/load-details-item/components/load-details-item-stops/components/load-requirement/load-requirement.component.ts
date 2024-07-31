import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Models
import {
    LoadResponse,
    TrailerTypeResponse,
    TruckTypeResponse,
} from 'appcoretruckassist';

// Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaTruckTrailerIconComponent } from '@shared/components/ta-truck-trailer-icon/ta-truck-trailer-icon.component';

// Helpers
import { LoadRequirementHelper } from '@pages/load/pages/load-details/components/load-details-item/utils/helpers/load-requirement.helper';

@Component({
    selector: 'app-load-requirement',
    templateUrl: './load-requirement.component.html',
    styleUrls: ['./load-requirement.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        NgbTooltipModule,
        TaAppTooltipV2Component,
        TaCustomCardComponent,
        TaTruckTrailerIconComponent,
    ],
})
export class LoadRequirementComponent implements OnInit, OnChanges {
    @Input() load: LoadResponse;
    public truck: TruckTypeResponse;
    public trailer: TrailerTypeResponse;

    public headerItems = LoadRequirementHelper.getLoadRequirementHeaderItems();
    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(): void {
        this.trailer = this.load.loadRequirements?.trailerType;
        this.truck = this.load.loadRequirements?.truckType;
    }

    public getNumericValue(value: string): string {
        return value ? value.match(/\d+/)[0] : '';
    }

    public trackByIdentity(id: number): number {
        return id;
    }
}
