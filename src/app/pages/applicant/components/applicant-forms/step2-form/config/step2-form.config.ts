import { ApplicantConfigParams } from '@pages/applicant/models/applicant-input-config.model';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class Step2FormConfig {
    static getEmployerInputConfig(config: ApplicantConfigParams): ITaInput {
        return {
            name: 'Employer',
            type: 'text',
            label: 'Business Name',
            isRequired: true,
            autoFocus: config.selectedMode === 'APPLICANT_MODE',
            textTransform: 'uppercase',
            minLength: 2,
            maxLength: 64,
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isEmployerValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getEmployerPhoneInputConfig(
        config: ApplicantConfigParams
    ): ITaInput {
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

    static getEmployerEmailInputConfig(
        config: ApplicantConfigParams
    ): ITaInput {
        return {
            name: 'Email',
            type: 'text',
            label: 'Email',
            isRequired: true,
            placeholderIcon: 'email',
            minLength: 5,
            maxLength: 64,
            textTransform: 'lowercase',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isEmailValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getEmployerFaxInputConfig(config: ApplicantConfigParams): ITaInput {
        return {
            name: 'Fax',
            type: 'text',
            label: 'Fax',
            placeholderIcon: 'fax',
            mask: '(000) 000-0000',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isFaxValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getEmployerAddressInputConfig(
        config: ApplicantConfigParams
    ): ITaInput {
        return {
            name: 'Address',
            type: 'text',
            label: 'Address, City, State Zip',
            isRequired: true,
            placeholderIcon: 'address',
            textTransform: 'capitalize',
            dropdownWidthClass: 'w-col-481',
            minLength: 12,
            maxLength: 256,
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isAddressValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getEmployerAddressUnitInputConfig(
        config: ApplicantConfigParams
    ): ITaInput {
        return {
            name: 'address-unit',
            type: 'text',
            label: 'Unit No.',
            minLength: 1,
            maxLength: 10,
            textTransform: 'uppercase',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isAddressUnitValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getJobDescriptionInputConfig(
        config: ApplicantConfigParams
    ): ITaInput {
        return {
            name: 'Description',
            type: 'text',
            label: 'Job description',
            isRequired: true,
            minLength: 2,
            maxLength: 160,
            textTransform: 'capitalize',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isJobDescriptionValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getFromDateInputConfig(config: ApplicantConfigParams): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            label: 'From',
            isDropdown: true,
            placeholderIcon: 'date',
            isRequired: true,
            customClass: 'datetimeclass',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isFromValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getToDateInputConfig(config: ApplicantConfigParams): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            label: 'To',
            isDropdown: true,
            placeholderIcon: 'date',
            isRequired: !config.currentEmploymentFormControl.value,
            customClass: 'datetimeclass',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isToValid) ||
                config.currentEmploymentFormControl.value,
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getReasonForLeavingInputConfig(
        config: ApplicantConfigParams
    ): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Reason for leaving',
            isRequired: !config.currentEmploymentFormControl.value,
            isDropdown: true,
            dropdownWidthClass: config.isEditing ? 'w-col-284' : 'w-col-292',
            isDisabled:
                config.selectedMode !== 'APPLICANT_MODE' ||
                config.currentEmploymentFormControl.value,
        };
    }

    static getAccountForPeriodInputConfig(
        config: ApplicantConfigParams
    ): ITaInput {
        return {
            name: 'Account for Period',
            type: 'text',
            label: 'Account for period between jobs (include reason)',
            textTransform: 'capitalize',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isAccountForPeriodBetweenValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }
}
