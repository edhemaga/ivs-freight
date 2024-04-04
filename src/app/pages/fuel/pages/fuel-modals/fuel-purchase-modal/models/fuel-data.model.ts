import { FuelTransactionListResponse } from 'appcoretruckassist';
import { FuelDataOptionsStringEnum } from '../../../../enums/fuel-data-options-string.enum';

export interface FuelData {
    id: number;
    type: FuelDataOptionsStringEnum;
    data: FuelTransactionListResponse;
}
