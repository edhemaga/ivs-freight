import { RepairItemResponse } from 'appcoretruckassist';
import { ExtendedServiceTypeResponse } from '@pages/repair/pages/repair-modals/repair-order-modal/models/extended-service-type-response.model';

export interface AddUpdateRepairProperties {
    convertedDate: string;
    conditionaTruckId: number;
    conditionaTrailerId: number;
    conditionaRepairShopId: number;
    convertedServiceTypes: ExtendedServiceTypeResponse[];
    convertedItems: RepairItemResponse[];
    convertedDocuments: any;
    convertedTagsArray: any;
}
