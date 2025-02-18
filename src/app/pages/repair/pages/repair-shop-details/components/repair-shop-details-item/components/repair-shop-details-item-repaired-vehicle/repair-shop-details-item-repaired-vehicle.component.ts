import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// services
import { RepairShopDetailsService } from '@pages/repair/pages/repair-shop-details/services';

// svg routes
import { RepairShopDetailsSvgRoutes } from '@pages/repair/pages/repair-shop-details/utils/svg-routes';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { CaSearchMultipleStatesComponent } from 'ca-components';

// constants
import { RepairShopDetailsItemConstants } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/utils/constants';

// pipes
import { DispatchColorFinderPipe, ThousandSeparatorPipe } from '@shared/pipes';

// models
import { RepairedVehicleResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-repair-shop-details-item-repaired-vehicle',
    templateUrl: './repair-shop-details-item-repaired-vehicle.component.html',
    styleUrls: ['./repair-shop-details-item-repaired-vehicle.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaAppTooltipV2Component,
        CaSearchMultipleStatesComponent,

        // pipes
        ThousandSeparatorPipe,
        DispatchColorFinderPipe,
    ],
})
export class RepairShopDetailsItemRepairedVehicleComponent implements OnInit {
    @Input() set repairedVehicleList(data: RepairedVehicleResponse[]) {
        this._repairedVehicleList = data;
    }
    @Input() searchConfig: boolean[];

    public _repairedVehicleList: RepairedVehicleResponse[] = [];

    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;

    public repairedVehicleListHeaderItems: string[];

    constructor(
        private router: Router,

        // services
        private repairShopDetailsService: RepairShopDetailsService
    ) {}

    ngOnInit(): void {
        this.getConstantData();
    }

    private getConstantData(): void {
        this.repairedVehicleListHeaderItems =
            RepairShopDetailsItemConstants.REPAIRED_VEHICLES_LIST_HEADER_ITEMS;
    }

    public handleViewDetailClick(unitType: string, id: number): void {
        this.router.navigate([`/list/${unitType.toLowerCase()}/${id}/details`]);
    }

    public handleCloseSearchEmit(): void {
        const detailsPartIndex = 1;

        this.repairShopDetailsService.setCloseSearchStatus(detailsPartIndex);
    }
}
