import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class CustomPeriodRangeConfig {
    static getFromDateConfig(): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            label: 'From',
            isDropdown: true,
            placeholderIcon: 'date',
            isRequired: true,
            customClass: 'datetimeclass dark',
        };
    }

    static getToDateConfig(): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            label: 'To',
            isDropdown: true,
            placeholderIcon: 'date',
            isRequired: true,
            customClass: 'datetimeclass dark',
        };
    }

    static getSubPeriodConfig(isSubPeriodDisabled: boolean): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Period View',
            isDisabled: isSubPeriodDisabled,
            isRequired: true,
            isDropdown: true,
            hideClear: true,
            hideColorValidations: true,
            isInputBackgroundRemoved: true,
            dropdownWidthClass: 'w-col-292',
        };
    }
}
