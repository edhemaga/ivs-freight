import { eVehicleList } from '@shared/components/ca-vehicle-list/enums';

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
