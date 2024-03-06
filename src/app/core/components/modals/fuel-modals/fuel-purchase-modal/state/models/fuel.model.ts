import { FuelTransactionListResponse } from 'appcoretruckassist';
import { FuelDataOptions } from '../enums/fuel.enum';

export interface FuelItems {
    itemfuel: number;
    price: number;
    qty: number;
    subtotal: number;
}

export interface FuelData {
    id: number;
    type: FuelDataOptions;
    data: FuelTransactionListResponse;
}

export interface FuelItemsDropdown {
    id?: number;
    name?: string;
}

export interface FuelTruckType {
    folder: string;
    id: number;
    logoName: string;
    name: string;
    number: string;
    subFolder: string;
}
