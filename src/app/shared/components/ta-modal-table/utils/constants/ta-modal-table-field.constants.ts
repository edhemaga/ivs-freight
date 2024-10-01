import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class ModalTableFieldsConstants {
    static getDepartmentField(): ITaInput {
        return {
            name: 'pm',
            type: 'text',
            label: 'Departmant',
            placeholderInsteadOfLabel: true,
            isDropdown: true,
            dropdownWidthClass: 'w-col-120',
            hideErrorMessage: true,
            hideRequiredCheck: true,
        };
    }

    static getPhoneField(): ITaInput {
        return {
            name: 'Phone',
            type: 'text',
            label: 'Phone',
            mask: '(000) 000-0000',
            maxLength: 14,
            hideRequiredCheck: true,
            placeholderInsteadOfLabel: true,
            hideErrorMessage: true,
        };
    }

    static getPhoneExtField(): ITaInput {
        return {
            name: 'ext',
            type: 'text',
            label: 'ext',
            placeholderInsteadOfLabel: true,
            minLength: 5,
            maxLength: 64,
            textTransform: 'uppercase',
            hideErrorMessage: true,
            hideRequiredCheck: true,
        };
    }

    static getEmailField(): ITaInput {
        return {
            name: 'email',
            type: 'text',
            label: 'email',
            placeholderInsteadOfLabel: true,
            minLength: 5,
            maxLength: 64,
            textTransform: 'lowercase',
            hideErrorMessage: true,
            hideRequiredCheck: true,
        };
    }
}
