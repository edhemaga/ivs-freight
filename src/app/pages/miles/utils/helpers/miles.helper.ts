// Moles
import { MilesByUnitResponse } from 'appcoretruckassist';
import { IMilesModel } from '@pages/miles/interface';

// Enums
import { ArrowActionsStringEnum } from '@shared/enums';

export class MilesHelper {
    static milesMapper(miles: MilesByUnitResponse[]): IMilesModel[] {
        const mappedMiles = miles.map((mile) => ({
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
        }));

        return mappedMiles;
    }

    static findAdjacentId(
        miles: IMilesModel[],
        currentId: number,
        direction: ArrowActionsStringEnum
    ): number | null {
        const index = miles.findIndex((mile) => mile.id === currentId);

        if (index === -1) {
            return null;
        }

        if (
            direction === ArrowActionsStringEnum.NEXT &&
            index < miles.length - 1
        ) {
            return miles[index + 1].id;
        }

        if (direction === ArrowActionsStringEnum.PREVIOUS && index > 0) {
            return miles[index - 1].id;
        }

        return null;
    }
}
