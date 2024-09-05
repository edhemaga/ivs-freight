import { TruckTrailerConfigParams } from '../../models';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class DispatchConfig {
    static getDispatchAddressConfig(): ITaInput {
        return {
            name: 'Address',
            type: 'text',
            label: 'Location',
            placeholder: 'Location',
            textTransform: 'capitalize',
            dropdownWidthClass: 'w-col-151',
            minLength: 12,
            maxLength: 256,
            autoFocus: true,
            placeholderInsteadOfLabel: true,
            hideErrorMessage: true,
            blackInput: true,
        };
    }

    static getTruckTrailerInputConfig(
        config: TruckTrailerConfigParams
    ): ITaInput {
        const {
            type,
            hasAdditionalFieldTruck,
            hasAdditionalFieldTrailer,
            truckDropdownWidth,
            trailerDropdownWidth,
        } = config;

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

    static getDispatchParkingConfig(): ITaInput {
        return {
            name: 'Spot',
            type: 'text',
            autoFocus: true,
            placeholder: 'Spot',
            label: 'Spot',
            blackInput: true,
            placeholderInsteadOfLabel: true,
            hideRequiredCheck: true,
        };
    }
}
