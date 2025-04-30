import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { ICaInput } from '@ca-shared/components/ca-input/config';
export class RepairShopConfig {
    static getNameInputConfig(): ITaInput {
        return {
            name: 'Shop Name',
            type: 'text',
            label: 'Shop Name',
            isRequired: true,
            textTransform: 'uppercase',
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

    static getAddressInputConfig(): ICaInput {
        return {
            name: 'Address',
            type: 'text',
            label: 'Address, City, State Zip',
            isRequired: true,
            placeholderIcon: 'address',
            textTransform: 'capitalize',
            dropdownWidthClass: 'w-col-376',
            minLength: 6,
            maxLength: 256
        };
    }

    static getAddressUnitInputConfig(): ITaInput {
        return {
            name: 'address-unit',
            type: 'text',
            label: 'Unit No.',
            textTransform: 'uppercase',
            minLength: 1,
            maxLength: 10,
        };
    }

    static getBankInputConfig(): ITaInput {
        return {
            name: 'Input Dropdown Bank Name',
            type: 'text',
            label: 'Bank Name',
            minLength: 2,
            maxLength: 64,
            textTransform: 'uppercase',
            isDropdown: true,
            dropdownWidthClass: 'w-col-163',
        };
    }

    static getPayPeriodConfig(): ITaInput {
        return {
            name: 'Input Dropdown Pay Period',
            type: 'text',
            label: 'Pay Period',
            minLength: 2,
            maxLength: 64,
            isDropdown: true,
            dropdownWidthClass: 'w-col-136',
        };
    }

    static getDayConfig(): ITaInput {
        return {
            name: 'Input Dropdown Pay',
            type: 'text',
            label: 'Day Period',
            minLength: 2,
            maxLength: 64,
            isDropdown: true,
            dropdownWidthClass: 'w-col-148',
        };
    }

    static getMonthlyPeriodConfig(): ITaInput {
        return {
            name: 'Input Dropdown Pay',
            type: 'text',
            label: 'Monthly Period',
            minLength: 2,
            maxLength: 64,
            isDropdown: true,
            dropdownWidthClass: 'w-col-148',
        };
    }

    static getRentInputConfig(): ITaInput {
        return {
            name: 'Rent',
            type: 'text',
            label: 'Rent',
            placeholderIcon: 'dollar',
            thousandSeparator: true,
            placeholderIconColor: 'blue',
        };
    }

    static getAccountNumberInputConfig(isBankSelected: boolean): ITaInput {
        return {
            name: 'account-bank',
            type: 'text',
            label: 'Account',
            isDisabled: !isBankSelected,
            isRequired: isBankSelected,
            maxLength: 17,
            minLength: 5,
        };
    }

    static getRoutingNumberInputConfig(isBankSelected: boolean): ITaInput {
        return {
            name: 'routing-bank',
            type: 'text',
            label: 'Routing',
            isDisabled: !isBankSelected,
            isRequired: isBankSelected,
            minLength: 9,
            maxLength: 9,
        };
    }

    static getOpenHoursFormField(): ITaInput {
        return {
            name: 'timepicker',
            type: 'text',
            placeholderIcon: 'time',
            customClass: 'datetimeclass',
            hideClear: true,
        };
    }
}
