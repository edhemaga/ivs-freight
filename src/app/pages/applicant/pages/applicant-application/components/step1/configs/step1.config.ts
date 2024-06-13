import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { Step1ConfigParams } from '@pages/applicant/pages/applicant-application/components/step1/models/step1-config-params.model';

export class Step1Config {
    static getFirstNameInputConfig(config: Step1ConfigParams): ITaInput {
        return {
            name: 'First Name',
            type: 'text',
            label: 'First Name',
            isRequired: true,
            minLength: 2,
            maxLength: 26,
            textTransform: 'capitalize',
            autoFocus: true,
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isFirstNameValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getLastNameInputConfig(config: Step1ConfigParams): ITaInput {
        return {
            name: 'Last Name',
            type: 'text',
            label: 'Last Name',
            isRequired: true,
            minLength: 2,
            maxLength: 26,
            textTransform: 'capitalize',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isLastNameValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getDateOfBirthInputConfig(config: Step1ConfigParams): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            label: 'DOB',
            isDropdown: true,
            placeholderIcon: 'date',
            isRequired: true,
            customClass: 'datetimeclass',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isDoBValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getSsnInputConfig(config: Step1ConfigParams): ITaInput {
        return {
            name: 'SSN',
            type: 'text',
            label: 'SSN',
            isRequired: true,
            mask: '000-00-0000',
            maxLength: 11,
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isSsnValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getPhoneInputConfig(config: Step1ConfigParams): ITaInput {
        return {
            name: 'Phone',
            type: 'text',
            label: 'Phone',
            isRequired: true,
            placeholderIcon: 'phone',
            mask: '(000) 000-0000',
            maxLength: 14,
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isPhoneValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getEmailInputConfig(): ITaInput {
        return {
            name: 'Email',
            type: 'text',
            label: 'Email',
            isRequired: true,
            placeholderIcon: 'email',
            minLength: 5,
            maxLength: 64,
            textTransform: 'lowercase',
        };
    }

    static getBankIdInputConfig(config: Step1ConfigParams): ITaInput {
        return {
            name: 'Input Dropdown Bank Name',
            type: 'text',
            label: 'Bank Name',
            minLength: 2,
            maxLength: 64,
            textTransform: 'uppercase',
            isDropdown: true,
            dropdownWidthClass: 'w-col-416',
            isDisabled: config.selectedMode !== 'APPLICANT_MODE',
        };
    }

    static getAccountNumberInputConfig(config: Step1ConfigParams): ITaInput {
        return {
            name: 'account-bank',
            type: 'text',
            label: 'Account number',
            isDisabled:
                (config.selectedMode === 'APPLICANT_MODE' &&
                    !config.isBankSelected) ||
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isAccountNumberValid),
            isRequired: config.isBankSelected,
            maxLength: 17,
            minLength: 5,
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getRoutingNumberInputConfig(config: Step1ConfigParams): ITaInput {
        return {
            name: 'routing-bank',
            type: 'text',
            label: 'Routing number',
            isDisabled:
                (config.selectedMode === 'APPLICANT_MODE' &&
                    !config.isBankSelected) ||
                config.selectedMode !== 'APPLICANT_MODE',
            isRequired: config.isBankSelected,
            maxLength: 17,
            minLength: 5,
        };
    }
}
