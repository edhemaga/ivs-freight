import {
    RepairListResponse,
    RepairShopMinimalResponse,
    RepairShopResponse,
    RepairedVehicleListResponse,
} from 'appcoretruckassist';

export interface RepairDetails {
    repairShop: RepairShopResponse[];
    repairList: RepairListResponse[];
    repairedVehicleList: RepairedVehicleListResponse[];
    repairShopMinimal: RepairShopMinimalResponse[];
}
