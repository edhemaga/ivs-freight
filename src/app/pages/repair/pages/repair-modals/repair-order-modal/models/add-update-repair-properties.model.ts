import { RepairItemResponse } from 'appcoretruckassist';
import { ExtendedServiceTypeResponse } from '@pages/repair/pages/repair-modals/repair-order-modal/models';

export interface AddUpdateRepairProperties {
    id?: number;
    convertedDate: string;
    conditionaTruckId: number;
    conditionaTrailerId: number;
    conditionaRepairShopId: number;
    convertedServiceTypes: ExtendedServiceTypeResponse[];
    convertedItems: RepairItemResponse[];
    convertedDocuments: any;
    convertedTagsArray: any;
}
