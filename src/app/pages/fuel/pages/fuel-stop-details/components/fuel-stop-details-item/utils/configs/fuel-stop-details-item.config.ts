import { eVehicleList } from 'ca-components';

// models
import { FuelledVehicleResponse } from 'appcoretruckassist';

export class FuelStopDetailsItemConfig {
    static getFuelledVehicleListConfig(
        list: FuelledVehicleResponse[],
        isSearchActive: boolean
    ) {
        return {
            type: eVehicleList.FUELLED_VEHICLE_LIST,
            list,
            isSearchActive,
        };
    }
}
