import { eVehicleList } from 'ca-components';

// models
import { RepairedVehicleResponse } from 'appcoretruckassist';

export class RepairShopDetailsItemConfig {
    static getRepairedVehicleListConfig(
        list: RepairedVehicleResponse[],
        isSearchActive: boolean
    ) {
        return {
            type: eVehicleList.REPAIRED_VEHICLE_LIST,
            list,
            isSearchActive,
        };
    }
}
