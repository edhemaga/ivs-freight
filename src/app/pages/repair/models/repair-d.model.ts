import {
    RepairedVehicleListResponse,
    RepairListResponse,
    RepairShopMinimalResponse,
    RepairShopResponse,
} from 'appcoretruckassist';

export interface IRepairD {
    repairShop: RepairShopResponse[];
    repairList: RepairListResponse[];
    repairedVehicleList: RepairedVehicleListResponse[];
    repairShopMinimal: RepairShopMinimalResponse[];
}
