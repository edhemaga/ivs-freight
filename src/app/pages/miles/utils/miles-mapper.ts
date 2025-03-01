import { MilesByUnitResponse } from 'appcoretruckassist';
import { IMilesModel } from '@pages/miles/models';

export function MilesMapper(miles: MilesByUnitResponse[]): IMilesModel[] {
    const a = miles.map((miles) => {
        return {
            unit: miles.truck?.truckNumber,
            truckType: miles.truck?.truckType,
            stopsCount: miles.stopsCount,
            stopsPickup: {
                count: miles.pickupCount,
                percent: miles.pickupPercentage
            },
            stopsDelivery: {
                count: miles.deliveryCount,
                percent: miles.deliveryPercentage
            },
            fuelCount: {
                count: miles.fuelCount,
                percent: miles.fuelPercentage
            },
            parkingCount: {
                count: miles.parkingCount,
                percent: miles.parkingPercentage
            },
            deadHeadCount: {
                count: miles.deadHeadCount,
                percent: miles.deadHeadPercentage
            },
            repairCount: {
                count: miles.repairCount,
                percent: miles.repairPercentage
            },
            towingCount: {
                count: miles.towingCount,
                percent: miles.towingPercentage
            },
            loadCount: miles.loadCount,
            fuelGalons: miles.fuelTotalGalons,
            fuelCost: miles.fuelCost,
            fuelMpg: miles.milesPerGalon,
            milesLoaded: miles.loadedMiles,
            milesEmpty: miles.emptyMiles,
            milesTotal: miles.totalMiles,
            revenue: miles.revenue
        };
    });

    console.log(a);
    return a;
}
