// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';

// models
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { TruckConfigOptions } from '@pages/applicant/pages/applicant-owner-info/models/truck-config-options.model';

export class ApplicantTruckConfig {
    static getTruckTypeConfig(options: TruckConfigOptions): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Type',
            isRequired: true,
            isDropdown: true,
            isDisabled: options.selectedMode !== SelectedMode.APPLICANT,
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                url: options.selectedTruckType?.logoName,
                template: 'truck',
                class: options.selectedTruckType?.name
                    ?.trim()
                    .replace(' ', '')
                    .toLowerCase(),
            },
            dropdownWidthClass: 'w-col-364',
            customClass: 'truck-Truck-dropdown',
        };
    }

    static getTruckYearConfig(options: TruckConfigOptions): ITaInput {
        return {
            name: 'Year',
            type: 'text',
            label: 'Year',
            isDisabled:
                options.selectedMode === SelectedMode.REVIEW ||
                (options.selectedMode === SelectedMode.FEEDBACK &&
                    options.stepFeedbackValues?.isTruckYearValid),
            isRequired: true,
            minLength: 4,
            maxLength: 4,
            incorrectInput: options.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getTruckVinConfig(options: TruckConfigOptions): ITaInput {
        return {
            name: 'vin-number',
            type: 'text',
            label: 'VIN',
            isRequired: true,
            isDisabled:
                options.selectedMode === SelectedMode.REVIEW ||
                (options.selectedMode === SelectedMode.FEEDBACK &&
                    options.stepFeedbackValues?.isTruckVinValid),
            textTransform: 'uppercase',
            maxLength: 17,
            minLength: 5,
            loadingSpinner: {
                size: 'small',
                color: 'white',
                isLoading: options.loadingTruckVinDecoder,
            },
            incorrectInput: options.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getTruckMakeConfig(options: TruckConfigOptions): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Make',
            isRequired: true,
            isDropdown: true,
            isDisabled: options.selectedMode !== SelectedMode.APPLICANT,
            dropdownImageInput: {
                withText: false,
                svg: true,
                image: false,
                url: options.selectedTruckMake?.logoName,
            },
            dropdownWidthClass: 'w-col-210',
        };
    }

    static getTruckModelConfig(options: TruckConfigOptions): ITaInput {
        return {
            name: 'truck-trailer-model',
            type: 'text',
            label: 'Model',
            isRequired: true,
            isDisabled:
                options.selectedMode === SelectedMode.REVIEW ||
                (options.selectedMode === SelectedMode.FEEDBACK &&
                    options.stepFeedbackValues?.isTruckModelValid),
            textTransform: 'uppercase',
            minLength: 1,
            maxLength: 50,
            incorrectInput: options.selectedMode === SelectedMode.REVIEW,
        };
    }

    static getTruckColorConfig(options: TruckConfigOptions): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Color',
            isDropdown: true,
            isDisabled: options.selectedMode !== SelectedMode.APPLICANT,
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                url: options.selectedTruckColor?.code ? 'ic_color.svg' : null,
                template: 'color',
                color: options.selectedTruckColor?.code,
            },
            dropdownWidthClass: 'w-col-116',
        };
    }
}
