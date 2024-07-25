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
                config.type === 'truck'
                    ? config.hasAdditionalFieldTruck
                        ? 'w-col-158'
                        : 'w-col-118'
                    : config.hasAdditionalFieldTrailer
                    ? 'w-col-158'
                    : 'w-col-125',
        };
    }
}
