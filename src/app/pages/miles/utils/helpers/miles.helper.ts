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
            truckId: mile.truck.id,
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
        currentIndex: number,
        direction: ArrowActionsStringEnum,
        totalResultsCount: number
    ): {
        index: number | null;
        isFirst: boolean;
        isLast: boolean;
        truckId: number;
        isLastInCurrentList: boolean;
    } {
        // Ensure the currentIndex is within the bounds of the array
        if (currentIndex < 0 || currentIndex >= miles.length) {
            return {
                index: null,
                isFirst: false,
                isLast: false,
                isLastInCurrentList: false,
                truckId: null,
            };
        }

        let newIndex = currentIndex;

        // Move to the next or previous index based on the direction
        if (
            direction === ArrowActionsStringEnum.NEXT &&
            currentIndex < miles.length - 1
        ) {
            newIndex = currentIndex + 1;
        } else if (
            direction === ArrowActionsStringEnum.PREVIOUS &&
            currentIndex > 0
        ) {
            newIndex = currentIndex - 1;
        }

        console.log(newIndex);

        // Return the result with the truckId at the new index
        return {
            truckId: miles[newIndex]?.truckId ?? null,
            index: newIndex,
            isFirst: newIndex === 0,
            isLastInCurrentList: newIndex === miles.length - 1,
            isLast: newIndex === totalResultsCount - 1,
        };
    }
}
