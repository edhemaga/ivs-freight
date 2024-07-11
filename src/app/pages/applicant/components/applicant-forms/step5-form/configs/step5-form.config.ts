import { ApplicantConfigParams } from '@pages/applicant/models/applicant-input-config.model';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class Step5FormConfig {
    static getAddressInputConfig(config: ApplicantConfigParams): ITaInput {
        return {
            name: 'Address',
            type: 'text',
            label: 'Location',
            minLength: 12,
            maxLength: 256,
            isRequired: true,
            placeholderIcon: 'address',
            textTransform: 'capitalize',
            dropdownWidthClass: config.isEditing ? 'w-col-424' : 'w-col-434',
            isDisabled:
                config.selectedMode === 'REVIEW_MODE' ||
                (config.selectedMode === 'FEEDBACK_MODE' &&
                    config.stepFeedbackValues?.isLocationValid),
            incorrectInput: config.selectedMode === 'REVIEW_MODE',
        };
    }

    static getDateInputConfig(config: ApplicantConfigParams): ITaInput {
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

    static getVehicleTypeInputConfig(config: ApplicantConfigParams): ITaInput {
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

    static getDescriptionInputConfig(config: ApplicantConfigParams): ITaInput {
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
