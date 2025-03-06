import { MilesByUnitResponse } from 'appcoretruckassist';
import { IMilesModel } from '@pages/miles/interface';

export function MilesMapper(miles: MilesByUnitResponse[]): IMilesModel[] {
    return miles.map((mile) => {
        return {
            unit: mile.truck?.truckNumber,
            truckType: mile.truck?.truckType,
            stopsCount: mile.stopsCount,
            stopsPickup: {
                count: mile.pickupCount,
                percent: mile.pickupPercentage,
            },
            stopsDelivery: {
                count: mile.deliveryCount,
                percent: mile.deliveryPercentage,
            },
            fuelCount: {
                count: mile.fuelCount,
                percent: mile.fuelPercentage,
            },
            parkingCount: {
                count: mile.parkingCount,
                percent: mile.parkingPercentage,
            },
            deadHeadCount: {
                count: mile.deadHeadCount,
                percent: mile.deadHeadPercentage,
            },
            repairCount: {
                count: mile.repairCount,
                percent: mile.repairPercentage,
            },
            towingCount: {
                count: mile.towingCount,
                percent: mile.towingPercentage,
            },
            loadCount: mile.loadCount,
            fuelGalons: mile.fuelTotalGalons,
            fuelCost: mile.fuelCost,
            fuelMpg: mile.milesPerGalon,
            milesLoaded: mile.loadedMiles,
            milesEmpty: mile.emptyMiles,
            milesTotal: mile.totalMiles,
            revenue: mile.revenue,
            id: mile.id,
            selected: false,
        };
    });
}
