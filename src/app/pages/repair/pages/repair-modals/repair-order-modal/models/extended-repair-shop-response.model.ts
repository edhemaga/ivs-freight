import { RepairShopResponse } from 'appcoretruckassist';

export interface ExtendedRepairShopResponse
    extends Omit<RepairShopResponse, 'address'> {
    address?: string;
}
