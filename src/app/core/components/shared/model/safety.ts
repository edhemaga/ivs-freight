import { ServerResponse } from './shared/response';

// Repair shop model
export interface RepairShop {
  id: number;
  name: string;
}

export interface RepairShopList extends ServerResponse {
  data: RepairShop[];
  count: number;
}

export interface RepairShopDetail extends ServerResponse {
  data: RepairShop;
}
