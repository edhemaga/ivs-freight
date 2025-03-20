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
    ): { id: number | null; isFirst: boolean; isLast: boolean } {
        const index = miles.findIndex((mile) => mile.id === currentId);

        if (index === -1) {
            return { id: null, isFirst: false, isLast: false };
        }

        let newIndex = index;
        if (
            direction === ArrowActionsStringEnum.NEXT &&
            index < miles.length - 1
        ) {
            newIndex = index + 1;
        } else if (direction === ArrowActionsStringEnum.PREVIOUS && index > 0) {
            newIndex = index - 1;
        }

        return {
            id: miles[newIndex].id,
            isFirst: newIndex === 0,
            isLast: newIndex === miles.length - 1,
        };
    }
}
