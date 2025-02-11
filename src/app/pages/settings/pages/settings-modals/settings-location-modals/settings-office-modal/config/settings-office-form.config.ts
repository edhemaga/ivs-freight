import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// enums
import { EGeneralActions } from '@shared/enums';

export class SettingsOfficeConfig {
    static getNameInputConfig(type: string): ITaInput {
        return {
            name: 'Office Name',
            type: 'text',
            label: 'Office Name',
            isRequired: true,
            textTransform: 'capitalize',
            autoFocus: type !== EGeneralActions.EDIT,
            minLength: 2,
            maxLength: 64,
        };
    }

    static getPhoneInputConfig(): ITaInput {
        return {
            name: 'Phone',
            type: 'text',
            label: 'Phone',
            placeholderIcon: 'phone',
            isRequired: false,
            mask: '(000) 000-0000',
            maxLength: 14,
        };
    }

    static getPhoneExtInputConfig(): ITaInput {
        return {
            name: 'phone-extension',
            type: 'text',
            label: 'Ext.',
            minLength: 1,
            maxLength: 8,
            placeholderIcon: 'phone-extension',
        };
    }

    static getEmailInputConfig(): ITaInput {
        return {
            name: 'Email',
            type: 'text',
            label: 'Email',
            placeholderIcon: 'email',
            minLength: 5,
            maxLength: 64,
            textTransform: 'lowercase',
        };
    }

    static getAddressInputConfig(): ITaInput {
        return {
            name: 'Address',
            type: 'text',
            label: 'Address, City, State Zip',
            isRequired: true,
            placeholderIcon: 'address',
            textTransform: 'capitalize',
            dropdownWidthClass: 'w-col-376',
            minLength: 6,
            maxLength: 256,
        };
    }

    static getAddressUnitInputConfig(): ITaInput {
        return {
            name: 'address-unit',
            type: 'text',
            label: 'Unit #',
            textTransform: 'uppercase',
            minLength: 1,
            maxLength: 10,
        };
    }

    static getPayPeriodInputConfig(): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Pay Period',
            isDropdown: true,
            dropdownWidthClass: 'w-col-148',
        };
    }

    static getMonthlyDayConfig(value: boolean): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Day',
            isRequired: value,
            isDropdown: true,
            isDisabled: !value,
            dropdownWidthClass: 'w-col-148',
        };
    }

    static getRentConfig(): ITaInput {
        return {
            name: 'Rent',
            type: 'text',
            label: 'Rent',
            placeholderIcon: 'dollar',
            thousandSeparator: true,
            minLength: 4,
            maxLength: 8,
        };
    }
}
