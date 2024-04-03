import {
    RepairListResponse,
    RepairShopMinimalResponse,
    RepairShopResponse,
    RepairedVehicleListResponse,
} from 'appcoretruckassist';

export interface IRepairD {
    repairShop: RepairShopResponse[];
    repairList: RepairListResponse[];
    repairedVehicleList: RepairedVehicleListResponse[];
    repairShopMinimal: RepairShopMinimalResponse[];
}
