import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

// components
import { CaVehicleListComponent } from 'ca-components';

// configs
import { FuelStopDetailsItemConfig } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-item/utils/configs';

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

    get vehicleListConfig() {
        return FuelStopDetailsItemConfig.getFuelledVehicleListConfig(
            this._fuelledVehicleList,
            this.searchConfig[1]
        );
    }

    constructor(private router: Router) {}

    public handleVehicleListActionsEmit(action: IVehicleListActionsEmit): void {
        const { unitType, unitId, isCloseSearch } = action;

        isCloseSearch
            ? null /* this.repairShopDetailsService.setCloseSearchStatus(1) */
            : this.router.navigate([
                  `/list/${unitType.toLowerCase()}/${unitId}/details`,
              ]);
    }
}
