import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class ContactModalConfig {
    static NAME_INPUT_CONFIG(
        isEditMode: boolean,
    ): ITaInput {
        return  {
            name: 'Name',
            type: 'text',
            label: 'Full Name',
            isRequired: true,
            minLength: 2,
            maxLength: 32,
            textTransform: 'capitalize',
            autoFocus: !isEditMode,
        }
    };

    static COMPANY_NAME_INPUT_CONFIG: ITaInput = {
        name: 'Company name',
        type: 'text',
        label: 'Company',
        textTransform: 'uppercase',
    };

    static COMPANY_LABEL_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown Label',
        type: 'text',
        label: 'Label',
        placeholderIcon: 'ic_dynamic_label',
        dropdownLabel: true,
        dropdownWidthClass: 'w-col-456',
        textTransform: 'lowercase',
        minLength: 1,
        maxLength: 32,
        blackInput: true,
        commands: {
            active: false,
            type: 'confirm-cancel',
            firstCommand: {
                popup: {
                    name: 'Confirm',
                    backgroundColor: '#3074d3',
                },
                name: 'confirm',
                svg: 'assets/svg/ic_spec-confirm.svg',
            },
            secondCommand: {
                popup: {
                    name: 'Cancel',
                    backgroundColor: '#2f2f2f',
                },
                name: 'cancel',
                svg: 'assets/svg/ic_x.svg',
            },
        },
    };

    static ADDRESS_INPUT_CONFIG: ITaInput = {
        name: 'Address',
        type: 'text',
        label: 'Address, City, State Zip',
        placeholderIcon: 'address',
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-376',
        minLength: 6,
        maxLength: 256,
    };

    static ADDRESS_UNIT_INPUT_CONFIG: ITaInput = {
        name: 'address-unit',
        type: 'text',
        label: 'Unit #',
        textTransform: 'uppercase',
        minLength: 1,
        maxLength: 10,
    };

    static SHARED_LABEL_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        minLength: 2,
        maxLength: 36,
        type: 'text',
        label: 'Department',
        isRequired: true,
        isDropdown: true,
        textTransform: 'capitalize',
        multiselectDropdown: true,
        dropdownWidthClass: 'w-col-456',
    };
}
