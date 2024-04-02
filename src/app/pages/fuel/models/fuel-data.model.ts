import { FuelTransactionListResponse } from 'appcoretruckassist';
import { FuelDataOptions } from '../enums/fuel.enum';

export interface FuelData {
    id: number;
    type: FuelDataOptions;
    data: FuelTransactionListResponse;
}
