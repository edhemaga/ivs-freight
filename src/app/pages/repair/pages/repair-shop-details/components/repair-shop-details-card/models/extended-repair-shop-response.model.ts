import { RepairShopDetailsStringEnum } from '@pages/repair/pages/repair-shop-details/enums';
import { RepairShopResponse } from 'appcoretruckassist';

export interface ExtendedRepairShopResponse extends RepairShopResponse {
    activeServicesCount?: number;
    bankInfo?: {
        title: string;
        value: string;
    }[];
}
