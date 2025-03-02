import { TruckTypeResponse } from "appcoretruckassist";

export interface IMilesModel {
    id: number;
    unit: string | undefined; 
    truckType: TruckTypeResponse | undefined; 
    stopsCount: number | undefined;
    stopsPickup: {
        count: number | undefined;
        percent: number | undefined;
    };
    stopsDelivery: {
        count: number | undefined;
        percent: number | undefined;
    };
    fuelCount: {
        count: number | undefined;
        percent: number | undefined;
    };
    parkingCount: {
        count: number | undefined;
        percent: number | undefined;
    };
    deadHeadCount: {
        count: number | undefined;
        percent: number | undefined;
    };
    repairCount: {
        count: number | undefined;
        percent: number | undefined;
    };
    towingCount: {
        count: number | undefined;
        percent: number | undefined;
    };
    loadCount: number | undefined;
    fuelGalons: number | null | undefined;
    fuelCost: number | null | undefined;
    fuelMpg: number | null | undefined;
    milesLoaded: number | undefined;
    milesEmpty: number | undefined;
    milesTotal: number | undefined;
    revenue: number | undefined;
    selected: boolean; 
}
