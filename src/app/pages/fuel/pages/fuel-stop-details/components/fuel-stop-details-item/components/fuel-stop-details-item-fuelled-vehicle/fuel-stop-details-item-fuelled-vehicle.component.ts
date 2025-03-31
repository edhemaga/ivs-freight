import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

// components
import { CaVehicleListComponent, eVehicleList } from 'ca-components';

// services
import { DetailsSearchService } from '@shared/services';

// enums
import { eFuelDetailsSearchIndex } from '@pages/fuel/pages/fuel-stop-details/enums';

// interfaces
import { IVehicleListActionsEmit } from '@ca-shared/components/ca-vehicle-list/interfaces';

// models
import { FuelledVehicleResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-fuel-stop-details-item-fuelled-vehicle',
    templateUrl: './fuel-stop-details-item-fuelled-vehicle.component.html',
    styleUrl: './fuel-stop-details-item-fuelled-vehicle.component.scss',
    standalone: true,
    imports: [
        // components
        CaVehicleListComponent,
    ],
})
export class FuelStopDetailsItemFuelledVehicleComponent {
    @Input() set fuelledVehicleList(data: FuelledVehicleResponse[]) {
        this._fuelledVehicleList = data;
    }
    @Input() searchConfig: boolean[];

    public _fuelledVehicleList: FuelledVehicleResponse[] = [];

    public eVehicleList = eVehicleList;

    // enums
    public eFuelDetailsSearchIndex = eFuelDetailsSearchIndex;

    constructor(
        private router: Router,
        private detailsSearchService: DetailsSearchService
    ) {}

    public handleVehicleListActionsEmit(action: IVehicleListActionsEmit): void {
        const { unitType, unitId, isCloseSearch } = action;

        isCloseSearch
            ? this.detailsSearchService.setCloseSearchStatus(
                  eFuelDetailsSearchIndex.VEHICLE_INDEX
              )
            : this.router.navigate([
                  `/list/${unitType.toLowerCase()}/${unitId}/details`,
              ]);
    }
}
