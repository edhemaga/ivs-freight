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

    public icon: {
        icon: string;
        name: string;
        color: string;
        className: string;
    };

    private trailerColorMap = {
        [TrailerNameStringEnum.REEFER]: TooltipColorsStringEnum.BLUE,
        [TrailerNameStringEnum.DRY_VAN]: TooltipColorsStringEnum.DARK_BLUE,
        [TrailerNameStringEnum.DUMPER]: TooltipColorsStringEnum.PURPLE,
        [TrailerNameStringEnum.TANKER]: TooltipColorsStringEnum.GREEN,
        [TrailerNameStringEnum.PNEUMATIC_TANKER]:
            TooltipColorsStringEnum.LIGHT_GREEN,
        [TrailerNameStringEnum.CAR_HAULER]: TooltipColorsStringEnum.PINK,
        [TrailerNameStringEnum.CAR_HAULER_STINGER]:
            TooltipColorsStringEnum.PINK,
        [TrailerNameStringEnum.CHASSIS]: TooltipColorsStringEnum.BROWN,
        [TrailerNameStringEnum.LOW_BOY_RGN]: TooltipColorsStringEnum.RED,
        [TrailerNameStringEnum.STEP_DECK]: TooltipColorsStringEnum.RED,
        [TrailerNameStringEnum.FLAT_BED]: TooltipColorsStringEnum.RED,
        [TrailerNameStringEnum.SIDE_KIT]: TooltipColorsStringEnum.ORANGE,
        [TrailerNameStringEnum.CONESTOGA]: TooltipColorsStringEnum.GOLD,
        [TrailerNameStringEnum.CONTAINER]: TooltipColorsStringEnum.YELLOW,
    };

    private truckColorMap = {
        [TruckNameStringEnum.SEMI_TRUCK]: TooltipColorsStringEnum.LIGHT_GREEN,
        [TruckNameStringEnum.SEMI_SLEEPER]: TooltipColorsStringEnum.YELLOW,
        [TruckNameStringEnum.BOX_TRUCK]: TooltipColorsStringEnum.RED,
        [TruckNameStringEnum.CARGO_VAN]: TooltipColorsStringEnum.BLUE,
        [TruckNameStringEnum.CAR_HAULER]: TooltipColorsStringEnum.PINK,
        [TruckNameStringEnum.TOW_TRUCK]: TooltipColorsStringEnum.PURPLE,
        [TruckNameStringEnum.SPOTTER]: TooltipColorsStringEnum.BROWN,
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
            icon: `${TruckTrailerIconEnum.TRAILER_SVG_ROUTE}${trailerType.logoName}`,
            name: trailerType.name,
            color:
                this.trailerColorMap[trailerType.name] ||
                TooltipColorsStringEnum.DEFAULT,
            className: trailerType.logoName.replace(
                TableStringEnum.SVG,
                TableStringEnum.EMPTY_STRING_PLACEHOLDER
            ),
        };
    }

    private mapTruck(): void {
        const truckType = this.inputData as TruckTypeResponse;
        this.icon = {
            icon: `${TruckTrailerIconEnum.TRUCK_SVG_ROUTE}${truckType.logoName}`,
            name: truckType.name,
            color:
                this.truckColorMap[truckType.name] ||
                TooltipColorsStringEnum.DEFAULT,
            className: truckType.logoName.replace(
                TableStringEnum.SVG,
                TableStringEnum.EMPTY_STRING_PLACEHOLDER
            ),
        };
    }
}
