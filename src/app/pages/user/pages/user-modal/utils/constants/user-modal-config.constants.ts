import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// enums
import { eGeneralActions } from '@shared/enums';

export class UserModalConfig {
    static MODAL_MAIN_TABS = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
        },
        {
            id: 2,
            name: 'Additional',
            disabled: true,
        },
    ];

    static TYPE_OF_EMPLOYEE = [
        {
            id: 3,
            name: 'User',
            checked: true,
        },
        {
            id: 4,
            name: 'Admin',
            checked: false,
        },
    ];

    static TYPE_OF_PAYROLL = [
        {
            id: 5,
            name: '1099',
            checked: true,
        },
        {
            id: 6,
            name: 'W-2',
            checked: false,
        },
    ];

    static emailInputConfig(
        selectedUserType: string,
        editDataType: string
    ): ITaInput {
        return {
            name: 'Email',
            type: 'text',
            label: 'Email',
            placeholderIcon: 'email',
            isRequired: true,
            minLength: 5,
            maxLength: 64,
            isDisabled: selectedUserType === 'Owner',
            textTransform: 'lowercase',
            autoFocus: editDataType !== eGeneralActions.EDIT_LOWERCASE,
        };
    }

    static firstNameInputConfig(selectedUserType: string): ITaInput {
        return {
            name: 'First name',
            type: 'text',
            label: 'First Name',
            isRequired: true,
            minLength: 2,
            maxLength: 26,
            isDisabled: selectedUserType === 'Owner',
            textTransform: 'capitalize',
        };
    }

    static lastNameInputConfig(selectedUserType: string): ITaInput {
        return {
            name: 'Last name',
            type: 'text',
            label: 'Last Name',
            minLength: 2,
            maxLength: 26,
            isRequired: true,
            isDisabled: selectedUserType === 'Owner',
            textTransform: 'capitalize',
        };
    }

    static departmentInputConfig(selectedUserType: string): ITaInput {
        return {
            name: 'Input Dropdown Department',
            minLength: 2,
            maxLength: 36,
            type: 'text',
            label: 'Department',
            textTransform: 'capitalize',
            isRequired: true,
            isDropdown: true,
            isDisabled: selectedUserType === 'Owner',
            dropdownWidthClass: 'w-col-308',
        };
    }

    static companyOfficeInputConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Office',
        isDropdown: true,
        dropdownWidthClass: 'w-col-258',
    };
}
