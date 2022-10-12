import { RepairShopResponse } from '../../../../../../../appcoretruckassist/model/repairShopResponse';
import { RepairShopMinimalResponse } from '../../../../../../../appcoretruckassist/model/repairShopMinimalResponse';
import { RepairListResponse } from '../../../../../../../appcoretruckassist/model/repairListResponse';

export interface IRepairD {
  repairShop: RepairShopResponse[];
  repairList: RepairListResponse[];
  repairShopMinimal: RepairShopMinimalResponse[];
}

// example insert repairShop_1, repairShop_2 .filter() .find(item => item.id === id)
