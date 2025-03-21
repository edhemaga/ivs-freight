import { TruckTypeResponse } from 'appcoretruckassist';

export interface ICountPercent {
    count: number | undefined;
    percent: number | undefined;
}

export interface IMilesModel {
    id: number;
    truckId: number;
    unit: string | undefined;
    truckType: TruckTypeResponse | undefined;
    stopsCount: number | undefined;
    stopsPickup: ICountPercent;
    stopsDelivery: ICountPercent;
    fuelCount: ICountPercent;
    parkingCount: ICountPercent;
    deadHeadCount: ICountPercent;
    repairCount: ICountPercent;
    towingCount: ICountPercent;
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
