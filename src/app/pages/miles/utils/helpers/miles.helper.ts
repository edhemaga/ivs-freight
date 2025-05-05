// models
import { MilesByUnitResponse } from 'appcoretruckassist';
import { IMilesModel } from '@pages/miles/interface';

export class MilesHelper {
    static milesMapper(miles: MilesByUnitResponse[]): IMilesModel[] {
        return miles.map((mile) => {
            const {
                id,
                truck,
                stopsCount,
                pickupCount,
                pickupPercentage,
                deliveryCount,
                deliveryPercentage,
                fuelCount,
                fuelPercentage,
                parkingCount,
                parkingPercentage,
                deadHeadCount,
                deadHeadPercentage,
                repairCount,
                repairPercentage,
                towingCount,
                towingPercentage,
                loadCount,
                fuelTotalGalons,
                fuelCost,
                milesPerGalon,
                loadedMiles,
                emptyMiles,
                totalMiles,
                revenue,
            } = mile;

            const mappedMile: IMilesModel = {
                id,
                isSelected: false,
                unit: truck?.truckNumber,
                truckType: truck?.truckType,
                truckId: truck?.id,
                stopsCount: {
                    value: stopsCount,
                },
                stopsPickup: {
                    count: pickupCount,
                    percent: pickupPercentage,
                },
                stopsDelivery: {
                    count: deliveryCount,
                    percent: deliveryPercentage,
                },
                fuelCount: {
                    count: fuelCount,
                    percent: fuelPercentage,
                },
                parkingCount: {
                    count: parkingCount,
                    percent: parkingPercentage,
                },
                deadHeadCount: {
                    count: deadHeadCount,
                    percent: deadHeadPercentage,
                },
                repairCount: {
                    count: repairCount,
                    percent: repairPercentage,
                },
                towingCount: {
                    count: towingCount,
                    percent: towingPercentage,
                },
                loadCount: {
                    value: loadCount,
                },
                fuelGalons: {
                    value: fuelTotalGalons,
                },
                fuelCost,
                fuelMpg: milesPerGalon,
                milesLoaded: {
                    value: loadedMiles,
                },
                milesEmpty: {
                    value: emptyMiles,
                },
                milesTotal: {
                    value: totalMiles,
                },
                revenue: {
                    value: revenue,
                },
            };

            return mappedMile;
        });
    }
}
