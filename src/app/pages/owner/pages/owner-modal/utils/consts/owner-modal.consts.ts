import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class OwnerModalConfig {
    static BUSINESS_NAME_INPUT_CONFIG(isEditMode: boolean): ITaInput {
        return {
            name: 'Business Name',
            type: 'text',
            label: 'Business Name',
            isRequired: true,
            textTransform: 'uppercase',
            autoFocus: !isEditMode,
            minLength: 2,
            maxLength: 64,
        };
    }

    static EIN_INPUT_CONFIG: ITaInput = {
        name: 'EIN',
        type: 'text',
        label: 'EIN #',
        isRequired: true,
        mask: '00-0000000',
        maxLength: 10,
    };

    static FIRST_NAME_INPUT_CONFIG(
        selectedTab: number,
        firstName: string
    ): ITaInput {
        return {
            name: 'First name',
            type: 'text',
            label: 'First Name',
            minLength: 2,
            maxLength: 26,
            isRequired: true,
            textTransform: 'capitalize',
            autoFocus: selectedTab === 2 && !firstName,
        };
    }
    static LAST_NAME_INPUT_CONFIG: ITaInput = {
        name: 'Last name',
        type: 'text',
        label: 'Last Name',
        minLength: 2,
        maxLength: 26,
        isRequired: true,
        textTransform: 'capitalize',
    };

    static SSN_INPUT_CONFIG: ITaInput = {
        name: 'SSN',
        type: 'text',
        label: 'SSN',
        isRequired: true,
        placeholderIcon: 'password',
        mask: '000-00-0000',
        maxLength: 11,
    };

    static PHONE_INPUT_CONFIG: ITaInput = {
        name: 'Phone',
        type: 'text',
        label: 'Phone',
        isRequired: true,
        placeholderIcon: 'phone',
        mask: '(000) 000-0000',
    };

    static EMAIL_INPUT_CONFIG: ITaInput = {
        name: 'Email',
        type: 'text',
        label: 'Email',
        isRequired: true,
        placeholderIcon: 'email',
        minLength: 5,
        maxLength: 64,
        textTransform: 'lowercase',
    };

    static ADDRESS_UNIT_INPUT_CONFIG: ITaInput = {
        name: 'address-unit',
        type: 'text',
        label: 'Unit #',
        textTransform: 'uppercase',
        minLength: 1,
        maxLength: 10,
    };

    static BANK_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown Bank Name',
        type: 'text',
        label: 'Bank Name',
        minLength: 2,
        maxLength: 64,
        textTransform: 'uppercase',
        isDropdown: true,
        dropdownWidthClass: 'w-col-164',
    };

    static ROUTING_NUMBER_INPUT_CONFIG(isBankSelected: boolean): ITaInput {
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

    static ACCOUNT_INPUT_CONFIG(isBankSelected: boolean): ITaInput {
        return {
            name: 'account-bank',
            type: 'text',
            label: 'Account',
            placeholderIcon: 'password',
            isDisabled: !isBankSelected,
            isRequired: isBankSelected,
            maxLength: 17,
            minLength: 5,
        };
    }
}
