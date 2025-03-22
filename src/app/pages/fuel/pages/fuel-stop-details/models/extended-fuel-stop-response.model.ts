import {
    FuelledVehicleResponse,
    FuelStopResponse,
    FuelTransactionResponse,
} from 'appcoretruckassist';

export interface ExtendedFuelStopResponse extends FuelStopResponse {
    transactionList: FuelTransactionResponse[];
    fuelledVehicleList: FuelledVehicleResponse[];
}
