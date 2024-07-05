// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';

// models
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { TrailerConfigOptions } from '@pages/applicant/pages/applicant-owner-info/models/trailer-config-options.model';

export class ApplicantTrailerConfig {
    static getTrailerTypeConfig(options: TrailerConfigOptions): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Type',
            isDropdown: true,
            isDisabled:
                options.selectedMode !== SelectedMode.APPLICANT ||
                (options.selectedMode === SelectedMode.APPLICANT &&
                    !options.isAddTrailerSelected),
            isRequired: options.isAddTrailerSelected,
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                url: options.selectedTrailerType?.logoName,
                template: 'trailer',
                class: ['Tanker', 'Tanker Pneumatic'].includes(
                    options.selectedTrailerType?.name
                )
                    ? 'tanker'
                    : options.selectedTrailerType?.name
                          ?.toLowerCase()
                          ?.includes('rgn')
                    ? 'low-boy-rgn'
                    : options.selectedTrailerType?.name
                          ?.trim()
                          ?.replace(' ', '')
                          ?.toLowerCase(),
            },
            dropdownWidthClass: 'w-col-364',
            customClass: 'truck-trailer-dropdown',
        };
    }

    static getTrailerVinConfig(options: TrailerConfigOptions): ITaInput {
        return {
            name: 'vin-number',
            type: 'text',
            label: 'VIN',
            textTransform: 'uppercase',
            maxLength: 17,
            minLength: 5,
            isDisabled:
                options.selectedMode === SelectedMode.REVIEW ||
                (options.selectedMode === SelectedMode.APPLICANT &&
                    !options.isAddTrailerSelected) ||
                (options.selectedMode === SelectedMode.FEEDBACK &&
                    options.stepFeedbackValues?.isTrailerVinValid),
            isRequired: options.isAddTrailerSelected,
            loadingSpinner: {
                size: 'small',
                color: 'white',
                isLoading: options.loadingTrailerVinDecoder,
            },
            incorrectInput: options.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getTrailerMakeConfig(options: TrailerConfigOptions): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Make',
            isDropdown: true,
            isDisabled:
                options.selectedMode !== SelectedMode.APPLICANT ||
                (options.selectedMode === SelectedMode.APPLICANT &&
                    !options.isAddTrailerSelected),
            isRequired: options.isAddTrailerSelected,
            dropdownImageInput: {
                withText: false,
                svg: true,
                image: false,
                url: options.selectedTrailerMake?.logoName,
            },
            placeholder: options.selectedTrailerMake?.name,
            dropdownWidthClass: 'w-col-302',
        };
    }

    static getTrailerModelConfig(options: TrailerConfigOptions): ITaInput {
        return {
            name: 'truck-trailer-model',
            type: 'text',
            label: 'Model',
            textTransform: 'uppercase',
            isRequired: options.isAddTrailerSelected,
            minLength: 1,
            maxLength: 50,
            isDisabled:
                options.selectedMode === SelectedMode.REVIEW ||
                (options.selectedMode === SelectedMode.APPLICANT &&
                    !options.isAddTrailerSelected) ||
                (options.selectedMode === SelectedMode.FEEDBACK &&
                    options.stepFeedbackValues?.isTrailerModelValid),
            incorrectInput: options.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getTrailerYearConfig(options: TrailerConfigOptions): ITaInput {
        return {
            name: 'Year',
            type: 'text',
            label: 'Year',
            minLength: 4,
            maxLength: 4,
            isDisabled:
                options.selectedMode === SelectedMode.REVIEW ||
                (options.selectedMode === SelectedMode.APPLICANT &&
                    !options.isAddTrailerSelected) ||
                (options.selectedMode === SelectedMode.FEEDBACK &&
                    options.stepFeedbackValues?.isTrailerYearValid),
            isRequired: options.isAddTrailerSelected,
            incorrectInput: options.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getTrailerColorConfig(options: TrailerConfigOptions): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Color',
            isDropdown: true,
            isDisabled:
                options.selectedMode !== SelectedMode.APPLICANT ||
                (options.selectedMode === SelectedMode.APPLICANT &&
                    !options.isAddTrailerSelected),
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                url: options.selectedTrailerColor?.code ? 'ic_color.svg' : null,
                template: 'color',
                color: options.selectedTrailerColor?.code,
            },
            dropdownWidthClass: 'w-col-216',
        };
    }

    static getTrailerLengthConfig(options: TrailerConfigOptions): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Length',
            isDropdown: true,
            isDisabled:
                options.selectedMode !== SelectedMode.APPLICANT ||
                (options.selectedMode === SelectedMode.APPLICANT &&
                    !options.isAddTrailerSelected),
            isRequired: options.isAddTrailerSelected,
            dropdownWidthClass: 'w-col-216',
        };
    }
}
