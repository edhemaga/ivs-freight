import { ISingleValue } from '@shared/interfaces';

// models
import { TruckTypeResponse } from 'appcoretruckassist';

export interface IMilesModel {
    id: number;
    isSelected: boolean;
    unit: string;
    truckType: TruckTypeResponse;
    truckId: number;
    stopsCount: ISingleValue;
    stopsPickup: ICountPercent;
    stopsDelivery: ICountPercent;
    deadHeadCount: ICountPercent;
    parkingCount: ICountPercent;
    fuelCount: ICountPercent;
    repairCount: ICountPercent;
    towingCount: ICountPercent;
    splitCount: ICountPercent;
    loadCount: ISingleValue;
    loadExtraStops: ISingleValue;
    loadRatePerMile: ISingleValue;
    fuelGalons: ISingleValue;
    fuelCost: ISingleValue;
    fuelMpg: number;
    milesLoaded: ISingleValue;
    milesEmpty: ISingleValue;
    milesTotal: ISingleValue;
    milesPerLoad: ISingleValue;
    revenue: ISingleValue;
    dateDeactivated: ISingleValue;
}

export interface ICountPercent {
    count: number;
    percent: number;
}
