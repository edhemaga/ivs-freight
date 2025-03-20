import { DropdownMenuContentHelper } from '@shared/utils/helpers';

// constants
import { FuelStopDetailsConstants } from '@pages/fuel/pages/fuel-stop-details/utils/constants';

// models
import { DetailsConfig, DetailsDropdownOptions } from '@shared/models';
import { ExtendedFuelStopResponse } from '@pages/fuel/pages/fuel-stop-details/models';

export class FuelStopDetailsHelper {
    static getDetailsDropdownOptions(
        fuelStopData: ExtendedFuelStopResponse
    ): DetailsDropdownOptions {
        const { favourite, isClosed } = fuelStopData;

        const actions = DropdownMenuContentHelper.getFuelStopDropdownContent(
            true,
            favourite,
            !isClosed,
            true
        );

        return {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            data: fuelStopData,
            actions,
            export: true,
        };
    }
    static getFuelStopDetailsConfig(
        fuelStopData: ExtendedFuelStopResponse
    ): DetailsConfig[] {
        const { isClosed, transactionList, fuelledVehicleList, totalCost } =
            fuelStopData;

        return [
            {
                id: 0,
                name: 'Fuel Stop Detail',
                template: 'general',
                isClosedBusiness: isClosed,
                data: fuelStopData,
            },
            {
                id: 1,
                name: 'Transaction',
                template: 'transaction',
                isClosedBusiness: isClosed,
                icon: true,
                hasSearch: true,
                hasSort: true,
                isSortBtn: true,
                hide: false,
                total: totalCost,
                length: transactionList?.length || '0',
                data: fuelStopData,
            },
            {
                id: 2,
                name: 'Vehicle',
                template: 'fuelled-vehicle',
                icon: false,
                hasSearch: true,
                hasSort: true,
                sortColumns: FuelStopDetailsConstants.VEHICLE_SORT_COLUMNS,
                hide: true,
                length: fuelledVehicleList?.length || '0',
                data: fuelStopData,
            },
        ];
    }
}
