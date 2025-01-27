import {
    AddressEntity,
    FuelStopFranchiseMinimalResponse,
    FuelStopResponse,
    GetTransactionModalFranchiseStopResponse,
} from 'appcoretruckassist';

export interface ExtendedFuelStopResponse
    extends GetTransactionModalFranchiseStopResponse {
    stores?: ExtendedFuelStopStore[];
    storeId?: number;
    name?: string;
    fuelStopFranchise?: FuelStopFranchiseMinimalResponse;
    fullAddress?: string;
}

interface ExtendedFuelStopStore extends Omit<FuelStopResponse, 'address'> {
    address?: string | AddressEntity;
}
