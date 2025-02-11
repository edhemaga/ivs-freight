// models
import { PayrollDriver } from "@pages/accounting/pages/payroll/state/models";
import { DriverFilterResponse } from "appcoretruckassist";

export interface FuelPurchaseModalConfigPipeArgs {
    configType: string;
    editDataType?: string;
    fuelTransactionTypeName?: string;
    fuelCardHolderName?: string;
    selectedTruckType?: { logoName: string; name: string };
    selectedDriver?: PayrollDriver;
    trailerId?: number;
    logoName?: string;
}
