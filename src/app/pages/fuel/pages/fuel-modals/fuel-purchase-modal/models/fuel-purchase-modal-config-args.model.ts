// models
import { DriverFilterResponse } from "appcoretruckassist";

export interface FuelPurchaseModalConfigPipeArgs {
    configType: string;
    editDataType?: string;
    fuelTransactionTypeName?: string;
    fuelCardHolderName?: string;
    selectedTruckType?: { logoName: string; name: string };
    selectedDriver?: DriverFilterResponse;
    trailerId?: number;
    logoName?: string;
}
