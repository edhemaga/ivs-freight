import { TruckTrailerConfigParams } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/truck-trailer-config-params.model';
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
        const { type, hasAdditionalFieldTruck, hasAdditionalFieldTrailer } =
            config;

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
                    ? hasAdditionalFieldTruck
                        ? 'w-col-158'
                        : 'w-col-138'
                    : hasAdditionalFieldTrailer
                    ? 'w-col-158'
                    : 'w-col-138',
        };
    }

    static getDriverInputConfig(): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Driver Name',
            placeholder: 'Driver Name',
            isDropdown: true,
            dropdownWidthClass: 'w-col-238',
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
