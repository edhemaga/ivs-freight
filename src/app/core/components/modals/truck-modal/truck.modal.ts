export interface CreateTruckCommand { 
    companyOwned?: boolean;
    truckNumber?: string | null;
    truckTypeId?: number;
    vin?: string | null;
    truckMakeId?: number;
    model?: string | null;
    year?: number;
    colorId?: number | null;
    ownerId?: number | null;
    commission?: number | null;
    note?: string | null;
    truckGrossWeightId?: number | null;
    emptyWeight?: number | null;
    truckEngineTypeId?: number | null;
    tireSizeId?: number | null;
    axles?: number | null;
    insurancePolicy?: string | null;
    mileage?: number | null;
    ipasEzpass?: string | null;
}