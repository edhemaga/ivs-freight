import { FuelStopResponse, FuelTransactionResponse } from 'appcoretruckassist';

export interface ExtendedFuelStopResponse extends FuelStopResponse {
    transactionList?: FuelTransactionResponse;
    lastFuelPriceConfig: LastFuelPriceConfig[];
}

interface LastFuelPriceConfig {
    title: string;
    totalValue: number;
    minValue: number;
    maxValue: number;
}
