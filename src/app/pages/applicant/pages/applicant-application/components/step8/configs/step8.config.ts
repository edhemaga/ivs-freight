import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { Step8ConfigParams } from '@pages/applicant/pages/applicant-application/components/step8/models/step8-config-params.model';

export class Step8Config {
    static getMotorCarrierInputConfig(config: Step8ConfigParams): ITaInput {
        return {
            name: 'Motor Carrier',
            type: 'text',
            label: 'Motor Carrier',
            isRequired: true,
            textTransform: 'capitalize',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isCarrierValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getPhoneInputConfig(config: Step8ConfigParams): ITaInput {
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

    static getAddressInputConfig(config: Step8ConfigParams): ITaInput {
        return {
            name: 'Address',
            type: 'text',
            label: 'Address, City, State Zip',
            isRequired: true,
            placeholderIcon: 'address',
            textTransform: 'capitalize',
            dropdownWidthClass: 'w-col-494',
            minLength: 6,
            maxLength: 256,
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isAddressValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getAddressUnitInputConfig(config: Step8ConfigParams): ITaInput {
        return {
            name: 'address-unit',
            type: 'text',
            label: 'Unit #',
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

    static getSapNameInputConfig(config: Step8ConfigParams): ITaInput {
        return {
            name: 'Name of SAP',
            type: 'text',
            label: 'Name of SAP',
            isRequired: true,
            textTransform: 'capitalize',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isSapValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getSapPhoneInputConfig(config: Step8ConfigParams): ITaInput {
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
                    config.stepFeedbackValues?.isSapPhoneValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getSapAddressInputConfig(config: Step8ConfigParams): ITaInput {
        return {
            name: 'Address',
            type: 'text',
            label: 'Address, City, State Zip',
            isRequired: true,
            placeholderIcon: 'address',
            textTransform: 'capitalize',
            dropdownWidthClass: 'w-col-494',
            minLength: 6,
            maxLength: 256,
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isSapAddressValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getSapAddressUnitInputConfig(config: Step8ConfigParams): ITaInput {
        return {
            name: 'address-unit',
            type: 'text',
            label: 'Unit #',
            minLength: 1,
            maxLength: 10,
            textTransform: 'uppercase',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isSapAddressUnitValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }
}
