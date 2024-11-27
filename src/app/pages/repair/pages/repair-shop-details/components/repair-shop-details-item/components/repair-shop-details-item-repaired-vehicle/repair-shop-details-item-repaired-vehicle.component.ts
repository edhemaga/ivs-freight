import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// svg routes
import { RepairShopDetailsSvgRoutes } from '@pages/repair/pages/repair-shop-details/utils/svg-routes';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { CaSearchMultipleStatesComponent } from 'ca-components';

// constants
import { RepairShopDetailsItemConstants } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/utils/constants';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes';

// models
import { RepairedVehicleListResponse } from 'appcoretruckassist';

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
    ],
})
export class RepairShopDetailsItemRepairedVehicleComponent implements OnInit {
    @Input() set repairedVehicleList(data: RepairedVehicleListResponse[]) {
        this.createRepairedVehicleListData(data);
    }
    @Input() searchConfig: boolean[];

    public _repairedVehicleList: RepairedVehicleListResponse[] = [];

    public repairShopDetailsSvgRoutes = RepairShopDetailsSvgRoutes;

    public repairedVehicleListHeaderItems: string[];

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.getConstantData();
    }

    public trackByIdentity = (index: number): number => index;

    private createRepairedVehicleListData(
        data: RepairedVehicleListResponse[]
    ): void {
        this._repairedVehicleList = data;
    }

    private getConstantData(): void {
        this.repairedVehicleListHeaderItems =
            RepairShopDetailsItemConstants.REPAIRED_VEHICLES_LIST_HEADER_ITEMS;
    }

    public handleViewDetailClick(unitType: string, id: number): void {
        this.router.navigate([`/list/${unitType.toLowerCase()}/${id}/details`]);
    }
}
