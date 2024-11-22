import { FuelTransactionListResponse } from 'appcoretruckassist';
import { FuelDataOptionsStringEnum } from '@pages/fuel/enums/fuel-data-options-string.enum';

export interface FuelData {
    id: number;
    type: FuelDataOptionsStringEnum;
    data: FuelTransactionListResponse;
    truckId: number;
    isShortModal: boolean;
    payrollOwnerId: number;
}
