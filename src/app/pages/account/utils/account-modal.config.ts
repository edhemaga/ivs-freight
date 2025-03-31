import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// enums
import { eGeneralActions } from '@shared/enums';
export class AccountModalConfig {
    static NAME_INPUT_CONFIG(isEditMode: boolean): ITaInput {
        return {
            name: 'Account Name',
            type: 'text',
            label: 'Account Name',
            isRequired: true,
            maxLength: 64,
            minLength: 2,
            textTransform: 'capitalize',
            autoFocus: !isEditMode,
        };
    }

    static COMPANY_LABEL_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown Label',
        type: 'text',
        label: 'Label',
        placeholderIcon: 'ic_dynamic_label',
        dropdownLabel: true,
        dropdownWidthClass: 'w-col-456',
        textTransform: 'lowercase',
        blackInput: true,
        minLength: 1,
        maxLength: 32,
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
                name: eGeneralActions.CANCEL,
                svg: 'assets/svg/ic_x.svg',
            },
        },
    };

    static USERNAME_INPUT_CONFIG: ITaInput = {
        name: 'Username',
        type: 'text',
        label: 'Username',
        placeholderIcon: 'user_icon',
        isRequired: true,
        minLength: 2,
        maxLength: 30,
    };

    static PASSWORD_INPUT_CONFIG: ITaInput = {
        name: 'Password',
        type: 'password',
        label: 'Password',
        placeholderIcon: 'password',
        isRequired: true,
        maxLength: 64,
    };

    static URL_INPUT_CONFIG: ITaInput = {
        name: 'Url',
        type: 'text',
        label: 'URL',
        placeholderIcon: 'ic_web',
        minLength: 4,
        maxLength: 255,
    };
}
