import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { Step5FormConfigParams } from '@pages/applicant/components/applicant-forms/step5-form/models/step5-config-params.model';

export class Step5FormConfig {
    static getAddressInputConfig(config: Step5FormConfigParams): ITaInput {
        return {
            name: 'Address',
            type: 'text',
            label: 'Location',
            minLength: 12,
            maxLength: 256,
            isRequired: true,
            placeholderIcon: 'address',
            textTransform: 'capitalize',
            dropdownWidthClass: 'w-col-481',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isLocationValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getDateInputConfig(config: Step5FormConfigParams): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            label: 'Date',
            isDropdown: true,
            placeholderIcon: 'date',
            isRequired: true,
            customClass: 'datetimeclass',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isDateValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getVehicleTypeInputConfig(config: Step5FormConfigParams): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Vehicle type',
            isRequired: true,
            isDropdown: true,
            isDisabled: config.selectedMode !== 'APPLICANT_MODE',
            dropdownWidthClass: 'w-col-200',
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                url: config.selectedVehicleType?.logoName,
                template: 'truck',
                class: config.selectedVehicleType?.name
                    ?.trim()
                    .replace(' ', '')
                    .toLowerCase(),
            },
            customClass: 'truck-trailer-dropdown',
        };
    }

    static getDescriptionInputConfig(config: Step5FormConfigParams): ITaInput {
        return {
            name: 'Description',
            type: 'text',
            label: 'Description',
            minLength: 2,
            maxLength: 160,
            isRequired: true,
            textTransform: 'capitalize',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isDescriptionValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }
}
