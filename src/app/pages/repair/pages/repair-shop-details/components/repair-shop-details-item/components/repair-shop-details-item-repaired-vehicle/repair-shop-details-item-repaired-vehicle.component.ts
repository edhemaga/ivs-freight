import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

// services
import { DetailsSearchService } from '@shared/services';

// components
import { CaVehicleListComponent, eVehicleList } from 'ca-components';

// enums
import { eRepairShopDetailsSearchIndex } from '@pages/repair/pages/repair-shop-details/enums';

// interfaces
import { IVehicleListActionsEmit } from '@ca-shared/components/ca-vehicle-list/interfaces';

// models
import { RepairedVehicleResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-repair-shop-details-item-repaired-vehicle',
    templateUrl: './repair-shop-details-item-repaired-vehicle.component.html',
    styleUrls: ['./repair-shop-details-item-repaired-vehicle.component.scss'],
    standalone: true,
    imports: [
        // components
        CaVehicleListComponent,
    ],
})
export class RepairShopDetailsItemRepairedVehicleComponent {
    @Input() set repairedVehicleList(data: RepairedVehicleResponse[]) {
        this._repairedVehicleList = data;
    }
    @Input() searchConfig: boolean[];

    public _repairedVehicleList: RepairedVehicleResponse[] = [];

    public eVehicleList = eVehicleList;

    // enums
    public eRepairShopDetailsSearchIndex = eRepairShopDetailsSearchIndex;

    constructor(
        private router: Router,

        // services
        private detailsSearchService: DetailsSearchService
    ) {}

    public handleVehicleListActionsEmit(action: IVehicleListActionsEmit): void {
        const { unitType, unitId, isCloseSearch } = action;

        isCloseSearch
            ? this.detailsSearchService.setCloseSearchStatus(
                  eRepairShopDetailsSearchIndex.VEHICLE_INDEX
              )
            : this.router.navigate([
                  `/list/${unitType.toLowerCase()}/${unitId}/details`,
              ]);
    }
}
