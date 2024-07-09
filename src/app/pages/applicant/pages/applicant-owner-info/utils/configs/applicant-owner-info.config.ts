// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';

// models
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { OwnerInfoConfigOptions } from '@pages/applicant/pages/applicant-owner-info/models/owner-info-config-options.model';


export class BusinessDetailsConfig {
    static getBusinessNameInputConfig(config: OwnerInfoConfigOptions): ITaInput {
        return {
            name: 'Company Name',
            type: 'text',
            label: 'Business Name',
            isRequired: true,
            isDisabled:
                config.selectedMode === SelectedMode.REVIEW ||
                (config.selectedMode === SelectedMode.FEEDBACK &&
                    config.stepFeedbackValues?.isBusinessNameValid),
            textTransform: 'uppercase',
            autoFocus: true,
            incorrectInput: config.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getEinInputConfig(config: OwnerInfoConfigOptions): ITaInput {
        return {
            name: 'EIN',
            type: 'text',
            label: 'EIN',
            mask: '00-0000000',
            maxLength: 10,
            isRequired: true,
            isDisabled:
                config.selectedMode === SelectedMode.REVIEW ||
                (config.selectedMode === SelectedMode.FEEDBACK &&
                    config.stepFeedbackValues?.isEinValid),
            incorrectInput: config.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getPhoneInputConfig(config: OwnerInfoConfigOptions): ITaInput {
        return {
            name: 'Phone',
            type: 'text',
            label: 'Phone',
            isRequired: true,
            isDisabled:
                config.selectedMode === SelectedMode.REVIEW ||
                (config.selectedMode === SelectedMode.FEEDBACK &&
                    config.stepFeedbackValues?.isPhoneValid),
            placeholderIcon: 'phone',
            mask: '(000) 000-0000',
            maxLength: 14,
            incorrectInput: config.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getEmailInputConfig(config: OwnerInfoConfigOptions): ITaInput {
        return {
            name: 'Email',
            type: 'text',
            label: 'Email',
            isRequired: true,
            isDisabled:
                config.selectedMode === SelectedMode.REVIEW ||
                (config.selectedMode === SelectedMode.FEEDBACK &&
                    config.stepFeedbackValues?.isEmailValid),
            placeholderIcon: 'email',
            autocomplete: 'off',
            minLength: 5,
            maxLength: 64,
            textTransform: 'lowercase',
            incorrectInput: config.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getAddressInputConfig(config: OwnerInfoConfigOptions): ITaInput {
        return {
            name: 'Address',
            type: 'text',
            label: 'Address, City, State Zip',
            isRequired: true,
            isDisabled:
                config.selectedMode === SelectedMode.REVIEW ||
                (config.selectedMode === SelectedMode.FEEDBACK &&
                    config.stepFeedbackValues?.isAddressValid),
            placeholderIcon: 'address',
            textTransform: 'capitalize',
            dropdownWidthClass: 'w-col-481',
            minLength: 12,
            maxLength: 256,
            incorrectInput: config.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getAddressUnitInputConfig(config: OwnerInfoConfigOptions): ITaInput {
        return {
            name: 'address-unit',
            type: 'text',
            label: 'Unit #',
            isDisabled:
                config.selectedMode === SelectedMode.REVIEW ||
                (config.selectedMode === SelectedMode.FEEDBACK &&
                    config.stepFeedbackValues?.isAddressUnitValid),
            minLength: 1,
            maxLength: 10,
            textTransform: 'uppercase',
            incorrectInput: config.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getBankInputConfig(config: OwnerInfoConfigOptions): ITaInput {
        return {
            name: 'Input Dropdown Bank Name',
            type: 'text',
            label: 'Bank Name',
            minLength: 2,
            maxLength: 64,
            textTransform: 'uppercase',
            isDropdown: true,
            dropdownWidthClass: 'w-col-212',
            isDisabled: config.selectedMode !== SelectedMode.APPLICANT,
        };
    }

    static getAccountNumberInputConfig(config: OwnerInfoConfigOptions): ITaInput {
        return {
            name: 'account-bank',
            type: 'text',
            label: 'Account number',
            isDisabled:
                config.selectedMode === SelectedMode.REVIEW ||
                (config.selectedMode === SelectedMode.APPLICANT &&
                    !config.isBankSelected) ||
                (config.selectedMode === SelectedMode.FEEDBACK &&
                    config.stepFeedbackValues?.isAccountValid),
            isRequired: config.isBankSelected,
            maxLength: 17,
            minLength: 5,
            incorrectInput: config.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getRoutingNumberInputConfig(config: OwnerInfoConfigOptions): ITaInput {
        return {
            name: 'routing-bank',
            type: 'text',
            label: 'Routing number',
            isDisabled:
                config.selectedMode !== SelectedMode.APPLICANT ||
                (config.selectedMode === SelectedMode.APPLICANT &&
                    !config.isBankSelected),
            isRequired: config.isBankSelected,
            minLength: 9,
            maxLength: 9,
        };
    }
}
