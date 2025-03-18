export interface IFuelPurchaseModalForm {
    efsAccount?: string;
    fuelCard?: string;
    invoice?: string;
    truckId?: string;
    trailerId?: number;
    driverFullName?: string;
    transactionDate?: string;
    transactionTime?: string;
    fuelStopStoreId?: number;
    // TODO: leave as any for now as we do not know type of fuelItems
    fuelItems?: any[];
    total?: number;
}
