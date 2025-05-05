import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TrailerNameStringEnum } from '@shared/enums/trailer-name-string.enum';
import { TruckNameStringEnum } from '@shared/enums/truck-name-string.enum';
import { TruckTrailerIconEnum } from '@shared/enums/truck-trailer-icon.enum';
import { TooltipColorsStringEnum } from '@shared/enums/tooltip-colors-string.enum';

// Models
import { TruckTypeResponse, TrailerTypeResponse } from 'appcoretruckassist';

// Components
import { TaAppTooltipV2Component } from '../ta-app-tooltip-v2/ta-app-tooltip-v2.component';

@Component({
    selector: 'app-ta-truck-trailer-icon',
    templateUrl: './ta-truck-trailer-icon.component.html',
    styleUrls: ['./ta-truck-trailer-icon.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        NgbTooltipModule,
        TaAppTooltipV2Component,
    ],
})
export class TaTruckTrailerIconComponent implements OnInit {
    @Input() iconType: TruckTrailerIconEnum;
    @Input() inputData: TruckTypeResponse | TrailerTypeResponse;
    @Input() unitNumber: string;

    public icon: {
        icon: string;
        name: string;
        color: string;
        className: string;
    };

    private trailerColorMap = {
        [TrailerNameStringEnum.FLAT_BED]: TooltipColorsStringEnum.BLUE,
        [TrailerNameStringEnum.STEP_DECK]: TooltipColorsStringEnum.BLUE,
        [TrailerNameStringEnum.LOW_BOY_RGN]: TooltipColorsStringEnum.BLUE,
        [TrailerNameStringEnum.CHASSIS]: TooltipColorsStringEnum.BLUE,
        [TrailerNameStringEnum.CONESTOGA]: TooltipColorsStringEnum.BLUE,
        [TrailerNameStringEnum.SIDE_KIT]: TooltipColorsStringEnum.BLUE,
        [TrailerNameStringEnum.CONTAINER]: TooltipColorsStringEnum.BLUE,
        [TrailerNameStringEnum.DRY_VAN]: TooltipColorsStringEnum.YELLOW,
        [TrailerNameStringEnum.REEFER]: TooltipColorsStringEnum.YELLOW,
        [TrailerNameStringEnum.END_DUMP]: TooltipColorsStringEnum.RED,
        [TrailerNameStringEnum.BOTTOM_DUMP]: TooltipColorsStringEnum.RED,
        [TrailerNameStringEnum.HOPPER]: TooltipColorsStringEnum.RED,
        [TrailerNameStringEnum.TANKER]: TooltipColorsStringEnum.RED,
        [TrailerNameStringEnum.PNEUMATIC_TANKER]: TooltipColorsStringEnum.RED,
        [TrailerNameStringEnum.CAR_HAULER]: TooltipColorsStringEnum.LIGHT_GREEN,
        [TrailerNameStringEnum.CAR_HAULER_STINGER]:
            TooltipColorsStringEnum.LIGHT_GREEN,
    };

    private truckColorMap = {
        [TruckNameStringEnum.SEMI_TRUCK]: TooltipColorsStringEnum.BLUE,
        [TruckNameStringEnum.SEMI_SLEEPER]: TooltipColorsStringEnum.BLUE,
        [TruckNameStringEnum.BOX_TRUCK]: TooltipColorsStringEnum.YELLOW,
        [TruckNameStringEnum.REEFER_TRUCK]: TooltipColorsStringEnum.YELLOW,
        [TruckNameStringEnum.CARGO_VAN]: TooltipColorsStringEnum.YELLOW,
        [TruckNameStringEnum.DUMP_TRUCK]: TooltipColorsStringEnum.RED,
        [TruckNameStringEnum.CEMENT_TRUCK]: TooltipColorsStringEnum.RED,
        [TruckNameStringEnum.GARBAGE_TRUCK]: TooltipColorsStringEnum.RED,
        [TruckNameStringEnum.TOW_TRUCK]: TooltipColorsStringEnum.LIGHT_GREEN,
        [TruckNameStringEnum.CAR_HAULER]: TooltipColorsStringEnum.LIGHT_GREEN,
        [TruckNameStringEnum.SPOTTER]: TooltipColorsStringEnum.LIGHT_GREEN,
    };

    constructor() {}

    ngOnInit(): void {
        this.mapData();
    }

    private mapData(): void {
        if (this.iconType === TruckTrailerIconEnum.TRUCK) {
            this.mapTruck();
        } else if (this.iconType === TruckTrailerIconEnum.TRAILER) {
            this.mapTrailer();
        } else {
            console.error('Wrong icon type for truck/trailer icon');
        }
    }

    private mapTrailer(): void {
        const trailerType = this.inputData as TrailerTypeResponse;
        this.icon = {
            icon:
                trailerType.logoName &&
                `${TruckTrailerIconEnum.TRAILER_SVG_ROUTE}${trailerType.logoName}`,
            name: trailerType.name,
            color:
                this.trailerColorMap[trailerType.name] ||
                TooltipColorsStringEnum.DEFAULT,
            className: trailerType.name
                .trim()
                .replace(' ', TableStringEnum.EMPTY_STRING_PLACEHOLDER)
                .toLowerCase(),
        };
    }

    private mapTruck(): void {
        const truckType = this.inputData as TruckTypeResponse;
        this.icon = {
            icon:
                truckType.logoName &&
                `${TruckTrailerIconEnum.TRUCK_SVG_ROUTE}${truckType.logoName}`,
            name: truckType.name,
            color:
                this.truckColorMap[truckType.name] ||
                TooltipColorsStringEnum.DEFAULT,
            className: truckType.name
                .trim()
                .replace(' ', TableStringEnum.EMPTY_STRING_PLACEHOLDER)
                .toLowerCase(),
        };
    }
}
