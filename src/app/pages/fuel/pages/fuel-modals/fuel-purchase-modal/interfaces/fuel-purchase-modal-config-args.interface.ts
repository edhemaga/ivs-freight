// models
import { PayrollDriver } from '@pages/accounting/pages/payroll/state/models';
import { FuelTruckType } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/models';

export interface IFuelPurchaseModalConfigPipeArgs {
    configType: string;
    editDataType?: string;
    fuelTransactionTypeName?: string;
    fuelCardHolderName?: string;
    selectedTruckType?: FuelTruckType;
    selectedDriver?: PayrollDriver;
    trailerId?: number;
    logoName?: string;
    isDisabled?: boolean;
}
