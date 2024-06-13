import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { Step6ConfigParams } from '@pages/applicant/pages/applicant-application/components/step6/models/step6-config-params.model';

export class Step6Config {
    static getDriverForCompanyBeforeExplainInputConfig(
        config: Step6ConfigParams
    ): ITaInput {
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

    static getDriverForCompanyToExplainInputConfig(
        config: Step6ConfigParams
    ): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            label: 'To',
            isDropdown: true,
            placeholderIcon: 'date',
            isRequired: true,
            customClass: 'datetimeclass',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isToValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getIsUnableToPreformJobInputConfig(
        config: Step6ConfigParams
    ): ITaInput {
        return {
            name: 'Explain',
            type: 'text',
            label: 'Please explain',
            isRequired: true,
            textTransform: 'capitalize',
            placeholder: 'Please explain',
            placeholderInsteadOfLabel: true,
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues
                        ?.isUnableToPreformJobDescriptionValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getEmergencyNameInputConfig(): ITaInput {
        return {
            name: 'Emergency Name',
            type: 'text',
            label: 'Name',
            placeholderInsteadOfLabel: true,
            isRequired: true,
            textTransform: 'capitalize',
            minLength: 2,
            maxLength: 24,
            hideErrorMessage: true,
            hideRequiredCheck: true,
        };
    }

    static getPhoneInputConfig(): ITaInput {
        return {
            name: 'Phone',
            type: 'text',
            label: 'Phone',
            placeholderInsteadOfLabel: true,
            isRequired: true,
            placeholderIcon: 'phone',
            mask: '(000) 000-0000',
            maxLength: 14,
            hideErrorMessage: true,
        };
    }

    static getRelationshipInputConfig(): ITaInput {
        return {
            name: 'Relationship',
            type: 'text',
            label: 'Relationship',
            placeholderInsteadOfLabel: true,
            textTransform: 'capitalize',
            minLength: 2,
            maxLength: 24,
            isRequired: true,
            hideErrorMessage: true,
            hideRequiredCheck: true,
        };
    }
}
