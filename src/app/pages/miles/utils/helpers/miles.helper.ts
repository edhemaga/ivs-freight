// models
import { MilesByUnitResponse } from 'appcoretruckassist';
import { IMappedMiles } from '@pages/miles/interfaces';

export class MilesHelper {
    static milesMapper(miles: MilesByUnitResponse[]): IMappedMiles[] {
        return miles.map((mile) => {
            const {
                id,
                truck,
                stopsCount,
                pickupCount,
                pickupPercentage,
                deliveryCount,
                deliveryPercentage,
                deadHeadCount,
                deadHeadPercentage,
                parkingCount,
                parkingPercentage,
                fuelCount,
                fuelPercentage,
                repairCount,
                repairPercentage,
                towingCount,
                towingPercentage,
                splitCount,
                splitPercentage,
                loadCount,
                extraStopCount,
                ratePerMile,
                fuelTotalGalons,
                fuelCost,
                milesPerGalon,
                loadedMiles,
                emptyMiles,
                totalMiles,
                milesPerLoad,
                revenue,
                deactivated,
            } = mile;

            const mappedMile: IMappedMiles = {
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
                deadHeadCount: {
                    count: deadHeadCount,
                    percent: deadHeadPercentage,
                },
                parkingCount: {
                    count: parkingCount,
                    percent: parkingPercentage,
                },
                fuelCount: {
                    count: fuelCount,
                    percent: fuelPercentage,
                },
                repairCount: {
                    count: repairCount,
                    percent: repairPercentage,
                },
                towingCount: {
                    count: towingCount,
                    percent: towingPercentage,
                },
                splitCount: {
                    count: splitCount,
                    percent: splitPercentage,
                },
                loadCount: {
                    value: loadCount,
                },
                loadExtraStops: {
                    value: extraStopCount,
                },
                loadRatePerMile: {
                    value: ratePerMile,
                },
                fuelGalons: {
                    value: fuelTotalGalons,
                },
                fuelCost: {
                    value: fuelCost,
                },
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
                milesPerLoad: {
                    value: milesPerLoad,
                },
                revenue: {
                    value: revenue,
                },
                dateDeactivated: {
                    value: deactivated,
                },
            };

            return mappedMile;
        });
    }
}
