import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// Enums
import { eGeneralActions } from '@shared/enums';

export class SettingsTerminalConfig {
    static getNameInputConfig(type: string): ITaInput {
        return {
            name: 'Terminal Name',
            type: 'text',
            label: 'Terminal Name',
            isRequired: true,
            textTransform: 'uppercase',
            autoFocus: type !== eGeneralActions.EDIT,
            minLength: 1,
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

    static getParkingSlotConfig(): ITaInput {
        return {
            name: 'Parking Slot',
            type: 'text',
            label: 'Parking Slot # (Truck)',
            minLength: 1,
            maxLength: 64,
        };
    }

    static getFullParkingSlotConfig(): ITaInput {
        return {
            name: 'Full Parking Slot',
            type: 'text',
            label: 'Full Parking Slot # (Semi Truck - Trailer)',
            minLength: 1,
            maxLength: 128,
        };
    }
}
