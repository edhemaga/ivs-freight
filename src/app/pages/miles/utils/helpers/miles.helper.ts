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
                    count: null, // w8 for back,
                    percent: null, // w8 for back,
                },
                loadCount: {
                    value: loadCount,
                },
                loadExtraStops: {
                    value: null, // w8 for back,
                },
                loadRatePerMile: {
                    value: null, // w8 for back,
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
                    value: null, // w8 for back,
                },
                revenue: {
                    value: revenue,
                },
                dateDeactivated: {
                    value: null, // w8 for back,
                },
            };

            return mappedMile;
        });
    }
}
