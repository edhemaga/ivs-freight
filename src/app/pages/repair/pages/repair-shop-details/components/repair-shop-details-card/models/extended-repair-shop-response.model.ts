import {
    RepairedVehicleResponse,
    RepairResponse,
    RepairShopResponse,
} from 'appcoretruckassist';

export interface ExtendedRepairShopResponse extends RepairShopResponse {
    activeServicesCount?: number;
    bankInfo?: {
        title: string;
        value: string;
    }[];
    repairList?: RepairResponse[];
    repairedVehicleList?: RepairedVehicleResponse[];
}
