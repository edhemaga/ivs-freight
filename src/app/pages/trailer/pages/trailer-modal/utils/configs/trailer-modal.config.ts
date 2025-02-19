import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { TrailerConfigInterface } from '@pages/trailer/pages/trailer-modal/models';

// enums
import { eGeneralActions } from '@shared/enums';
import { ICaInput } from '@ca-shared/components/ca-input/config';

export class TrailerModalConfig {
    static getVolumenTrailers(): string[] {
        return [
            'Tanker',
            'Hopper',
            'Bottom Dump',
            'End Dump',
            'Pneumatic Tanker',
        ];
    }

    static getIsDoorAndLiftGate(): string[] {
        return ['Dry Van', 'Reefer', 'Container'];
    }

    static getTrailerNumberConfig(options: TrailerConfigInterface): ITaInput {
        return {
            name: 'vehicle-unit',
            type: 'text',
            label: 'Unit No.',
            isRequired: true,
            textTransform: 'uppercase',
            minLength: 1,
            maxLength: 8,
            autoFocus: options?.editType !== eGeneralActions.EDIT,
        };
    }
    static getTrailerTypeIdConfig(options: TrailerConfigInterface): ICaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Type',
            isRequired: true,
            isDropdown: true,
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                iconsPath: 'assets/ca-components/svg/common/trailers/',
                activeItemIconKey: 'logoName',
                url:
                    options.selectedTrailerType?.logoName &&
                    'assets/svg/common/trailers/' +
                        options.selectedTrailerType?.logoName,
                template: 'trailer',
                class: ['Tanker', 'Pneumatic Tanker'].includes(
                    options.selectedTrailerType?.name
                )
                    ? 'tanker'
                    : options.selectedTrailerType?.name
                            ?.toLowerCase()
                            ?.includes('rgn')
                      ? 'low-boy-rgn'
                      : options.selectedTrailerType?.name
                            ?.trim()
                            .replace(' ', '')
                            .toLowerCase(),
            },
            dropdownWidthClass: 'w-col-212',
            customClass: 'truck-trailer-dropdown',
        };
    }
    static getTrailerLengthConfig(): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Length',
            isDropdown: true,
            isRequired: true,
            dropdownWidthClass: 'w-col-100',
        };
    }
    static getTrailerYearConfig(): ITaInput {
        return {
            name: 'Year',
            type: 'text',
            label: 'Year',
            isRequired: true,
            minLength: 4,
            maxLength: 4,
        };
    }
    static getTrailerVinConfig(options: TrailerConfigInterface): ITaInput {
        return {
            name: 'vin-number',
            type: 'text',
            label: 'VIN',
            isRequired: true,
            textTransform: 'uppercase',
            maxLength: 17,
            minLength: 5,
            loadingSpinner: {
                size: 'small',
                color: 'white',
                isLoading: options.loadingVinDecoder,
            },
        };
    }
    static getTrailerMakeConfig(options: TrailerConfigInterface): ICaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Make',
            isRequired: true,
            isDropdown: true,
            dropdownImageInput: {
                withText: false,
                svg: true,
                image: false, 
                iconsPath: '',
                activeItemIconKey: 'logoName',
                url: options.selectedTrailerMake?.logoName,
                class: 'trailer-make',
            },
            placeholder: options.selectedTrailerMake?.name,
            dropdownWidthClass: 'w-col-156',
        };
    }
    static getTrailerModelConfig(): ITaInput {
        return {
            name: 'truck-trailer-model',
            type: 'text',
            label: 'Model',
            textTransform: 'uppercase',
            minLength: 1,
            maxLength: 50,
        };
    }
    static getTrailerColorConfig(options: TrailerConfigInterface): ICaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Color',
            isDropdown: true,
            dropdownImageInput: {
                withText: true,
                svg: true,
                image: false,
                iconsPath:
                    'ic_color.svg',
                activeItemIconKey: '',
                template: 'color',
            },
            dropdownWidthClass: 'w-col-164',
        };
    }
    static getTrailerOwnerConfig(): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Owner',
            isDropdown: true,
            isRequired: true,
            dropdownWidthClass: 'w-col-456',
        };
    }
    static getTrailerReferConfig(): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Reefer Unit',
            isDropdown: true,
            dropdownWidthClass: 'w-col-136',
        };
    }
    static getTrailerVolumeConfig(options: TrailerConfigInterface): ITaInput {
        return {
            name: 'trailer-volume',
            type: 'text',
            label: 'Volume',
            minLength: 5,
            maxLength: 7,
            placeholderText: options.formValue
                ? options.selectedTrailerType?.name === 'Tanker'
                    ? 'gal'
                    : 'cu_ft'
                : null,
            priceSeparator: true,
            priceSeparatorLimitation: 6,
        };
    }
    static getTrailerWeightConfig(options: TrailerConfigInterface): ITaInput {
        return {
            name: 'Empty Weight',
            type: 'text',
            label: 'Empty Weight',
            minLength: 4,
            maxLength: 6,
            priceSeparator: true,
            priceSeparatorLimitation: 6,
            placeholderText: !options.formValue ? '' : 'ibs',
        };
    }
    static getTrailerTireSizeConfig(): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Tire Size',
            isDropdown: true,
            dropdownWidthClass: 'w-col-148',
        };
    }
    static getTrailerSuspensionConfig(
        options: TrailerConfigInterface
    ): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Suspension',
            isDropdown: true,
            dropdownWidthClass:
                options.formValue !== 'Reefer' ? 'w-col-228' : 'w-col-108',
        };
    }
    static getTrailerDoorTypeConfig(): ITaInput {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Door Type',
            isDropdown: true,
            dropdownWidthClass: 'w-col-108',
        };
    }
    static getTrailerMileageConfig(): ITaInput {
        return {
            name: 'Mileage',
            type: 'text',
            label: 'Mileage',
            minLength: 1,
            maxLength: 10,
            placeholderText: 'mi',
            priceSeparator: true,
            priceSeparatorLimitation: 6,
        };
    }
    static getTrailerInsurancePolicyConfig(): ITaInput {
        return {
            name: 'insurance-policy',
            type: 'text',
            label: 'Insurance Policy',
            minLength: 8,
            maxLength: 14,
            textTransform: 'uppercase',
        };
    }
    static getTrailerFhwaExpConfig(): ITaInput {
        return {
            name: 'months',
            type: 'text',
            placeholderText: 'months',
            label: 'FHWA Exp.',
            isRequired: true,
            hideClear: true,
            removeLeadingZero: true,
            commands: {
                active: true,
                type: 'months',
                firstCommand: {
                    name: 'minus',
                    svg: 'assets/svg/common/ic_pm_decrement.svg',
                },
                secondCommand: {
                    name: 'plus',
                    svg: 'assets/svg/common/ic_pm_increment.svg',
                },
            },
        };
    }
    static getTrailerPurchaseDateConfig(): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            label: 'Purchase Date',
            isDropdown: true,
            placeholderIcon: 'date',
            customClass: 'datetimeclass',
            isFutureDateDisabled: true,
        };
    }
    static getTrailerPurchasePriceConfig(): ITaInput {
        return {
            name: 'Purchase Price',
            type: 'text',
            label: 'Purchase Price',
            maxLength: 14,
            priceSeparator: true,
            priceSeparatorLimitation: 6,
            placeholderIcon: 'dollar',
        };
    }

    static getTrailerAxlesConfig(): ITaInput {
        return {
            name: 'Axles',
            type: 'number',
            label: 'Axles',
            minLength: 1,
            maxLength: 2,
        };
    }
}
