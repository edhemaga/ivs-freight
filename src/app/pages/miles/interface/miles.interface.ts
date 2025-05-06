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
    fuelCount: ICountPercent;
    parkingCount: ICountPercent;
    deadHeadCount: ICountPercent;
    repairCount: ICountPercent;
    towingCount: ICountPercent;
    loadCount: ISingleValue;
    fuelGalons: ISingleValue;
    fuelCost: number;
    fuelMpg: number;
    milesLoaded: ISingleValue;
    milesEmpty: ISingleValue;
    milesTotal: ISingleValue;
    revenue: ISingleValue;
}

export interface ICountPercent {
    count: number;
    percent: number;
}
