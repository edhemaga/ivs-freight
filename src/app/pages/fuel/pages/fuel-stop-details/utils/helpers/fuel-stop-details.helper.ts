import { DetailsConfig } from '@shared/models';
import { FuelStopResponse } from 'appcoretruckassist';

export class FuelStopDetailsHelper {
    static getFuelStopDetailsConfig(
        fuelStopData: FuelStopResponse
    ): DetailsConfig[] {
        return [
            {
                id: 0,
                name: 'Fuel Stop Detail',
                template: 'general',
                data: fuelStopData,
            },
            {
                id: 1,
                name: 'Transaction',
                template: 'transaction',
                icon: true,
                length: 25,
                customText: 'Date',
                status: false,
                data: fuelStopData,
            },
            {
                id: 2,
                name: 'Vehicle',
                template: 'fuelled-vehicle',
                length: 18,
                hide: true,
                status: true,
                customText: 'Cost',
                data: fuelStopData,
            },
        ];
    }
}
