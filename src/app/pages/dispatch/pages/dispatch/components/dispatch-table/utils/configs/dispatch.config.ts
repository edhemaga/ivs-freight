import { TruckTrailerConfigParams } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class DispatchConfig {
    static getDispatchAddressConfig(locationDropdownWidth: number): ITaInput {
        return {
            name: 'Address',
            type: 'text',
            textTransform: 'capitalize',
            isDropdown: true,
            autoFocus: true,
            hideDropdownArrow: true,
            blackInput: true,
            hideRequiredCheck: true,
            hideDangerMark: true,
            hideErrorMessage: true,
            mergeDropdownBodyWithInput: true,
            isDispatchLocationDropdown: true,
            dropdownWidthClass: `w-col-${locationDropdownWidth}`,
        };
    }

    static getTruckTrailerInputConfig(
        config: TruckTrailerConfigParams
    ): ITaInput {
        const { type, truckDropdownWidth, trailerDropdownWidth } = config;

        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Unit No.',
            isDropdown: true,
            placeholderInsteadOfLabel: true,
            hideDropdownArrow: true,
            autoFocus: true,
            blackInput: true,
            hideRequiredCheck: true,
            hideDangerMark: true,
            hideErrorMessage: true,
            mergeDropdownBodyWithInput: true,
            dropdownWidthClass:
                type === 'truck'
                    ? `w-col-${truckDropdownWidth}`
                    : `w-col-${trailerDropdownWidth}`,
        };
    }

    static getDriverInputConfig(driverDropdownWidth: number): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Driver Name',
            placeholder: 'Driver Name',
            isDropdown: true,
            dropdownWidthClass: `w-col-${driverDropdownWidth}`,
            placeholderInsteadOfLabel: true,
            hideDropdownArrow: true,
            autoFocus: true,
            blackInput: true,
            hideRequiredCheck: true,
            hideDangerMark: true,
            hideErrorMessage: true,
            mergeDropdownBodyWithInput: true,
        };
    }

    static getDispatchParkingConfig(parkingDropdownWidth: number): ITaInput {
        return {
            name: 'Spot',
            type: 'text',
            autoFocus: true,
            placeholder: 'Spot',
            label: 'Spot',
            blackInput: true,
            placeholderInsteadOfLabel: true,
            hideRequiredCheck: true,
            dropdownWidthClass: `w-col-${parkingDropdownWidth}`,
        };
    }
}
