import { RepairShopResponse } from '../../../../../../../appcoretruckassist/model/repairShopResponse';
import { RepairShopMinimalResponse } from '../../../../../../../appcoretruckassist/model/repairShopMinimalResponse';
import { RepairListResponse } from '../../../../../../../appcoretruckassist/model/repairListResponse';
import { RepairedVehicleListResponse } from 'appcoretruckassist';

export interface IRepairD {
   repairShop: RepairShopResponse[];
   repairList: RepairListResponse[];
   repairedVehicleList: RepairedVehicleListResponse[];
   repairShopMinimal: RepairShopMinimalResponse[];
}
