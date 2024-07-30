import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Models
import { LoadResponse } from 'appcoretruckassist';

// Enums
import { TooltipColorsStringEnum } from '@shared/enums/tooltip-colors-string,enum';
import { TruckNameStringEnum } from '@shared/enums/truck-name-string.enum';
import { TrailerNameStringEnum } from '@shared/enums/trailer-name-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
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
    ],
})
export class LoadRequirementComponent implements OnInit, OnChanges {
    @Input() load: LoadResponse;
    public truck: {
        icon: string;
        name: string;
        color: string;
        className: string;
    };
    public trailer: {
        icon: string;
        name: string;
        color: string;
        className: string;
    };

    public headerItems = LoadRequirementHelper.getLoadRequirementHeaderItems();
    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(): void {
        this.mapTruck();
        this.mapTrailer();
    }

    public getNumericValue(value: string): string {
        return value ? value.match(/\d+/)[0] : '';
    }

    private mapTrailer(): void {
        const loadRequirements = this.load?.loadRequirements;
        if (loadRequirements && loadRequirements.trailerType) {
            const { trailerType } = loadRequirements;
            this.trailer = {
                icon: `assets/svg/common/trailers/${trailerType.logoName}`,
                name: trailerType.name,
                color: this.setTrailerTooltipColor(trailerType.name),
                className: trailerType.logoName.replace(
                    TableStringEnum.SVG,
                    TableStringEnum.EMPTY_STRING_PLACEHOLDER
                ),
            };
        } else {
            this.trailer = null;
        }
    }

    private mapTruck(): void {
        const loadRequirements = this.load?.loadRequirements;
        if (loadRequirements && loadRequirements.truckType) {
            const { truckType } = loadRequirements;
            this.truck = {
                icon: `assets/svg/common/trucks/${truckType.logoName}`,
                name: truckType.name,
                color: this.setTruckTooltipColor(truckType.name),
                className: truckType.logoName.replace(
                    TableStringEnum.SVG,
                    TableStringEnum.EMPTY_STRING_PLACEHOLDER
                ),
            };
        } else {
            this.truck = null;
        }
    }

    private setTrailerTooltipColor(trailerName: string): string {
        if (trailerName === TrailerNameStringEnum.REEFER) {
            return TooltipColorsStringEnum.BLUE;
        } else if (trailerName === TrailerNameStringEnum.DRY_VAN) {
            return TooltipColorsStringEnum.DARK_BLUE;
        } else if (trailerName === TrailerNameStringEnum.DUMPER) {
            return TooltipColorsStringEnum.PURPLE;
        } else if (trailerName === TrailerNameStringEnum.TANKER) {
            return TooltipColorsStringEnum.GREEN;
        } else if (trailerName === TrailerNameStringEnum.PNEUMATIC_TANKER) {
            return TooltipColorsStringEnum.LIGHT_GREEN;
        } else if (trailerName === TrailerNameStringEnum.CAR_HAULER) {
            return TooltipColorsStringEnum.PINK;
        } else if (trailerName === TrailerNameStringEnum.CAR_HAULER_STINGER) {
            return TooltipColorsStringEnum.PINK;
        } else if (trailerName === TrailerNameStringEnum.CHASSIS) {
            return TooltipColorsStringEnum.BROWN;
        } else if (trailerName === TrailerNameStringEnum.LOW_BOY_RGN) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.STEP_DECK) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.FLAT_BED) {
            return TooltipColorsStringEnum.RED;
        } else if (trailerName === TrailerNameStringEnum.SIDE_KIT) {
            return TooltipColorsStringEnum.ORANGE;
        } else if (trailerName === TrailerNameStringEnum.CONESTOGA) {
            return TooltipColorsStringEnum.GOLD;
        } else if (trailerName === TrailerNameStringEnum.CONTAINER) {
            return TooltipColorsStringEnum.YELLOW;
        }
    }

    private setTruckTooltipColor(truckName: string): string {
        if (truckName === TruckNameStringEnum.SEMI_TRUCK) {
            return TooltipColorsStringEnum.LIGHT_GREEN;
        } else if (truckName === TruckNameStringEnum.SEMI_SLEEPER) {
            return TooltipColorsStringEnum.YELLOW;
        } else if (truckName === TruckNameStringEnum.BOX_TRUCK) {
            return TooltipColorsStringEnum.RED;
        } else if (truckName === TruckNameStringEnum.CARGO_VAN) {
            return TooltipColorsStringEnum.BLUE;
        } else if (truckName === TruckNameStringEnum.CAR_HAULER) {
            return TooltipColorsStringEnum.PINK;
        } else if (truckName === TruckNameStringEnum.TOW_TRUCK) {
            return TooltipColorsStringEnum.PURPLE;
        } else if (truckName === TruckNameStringEnum.SPOTTER) {
            return TooltipColorsStringEnum.BROWN;
        }
    }

    public trackByIdentity(id: number): number {
        return id;
    }
}
