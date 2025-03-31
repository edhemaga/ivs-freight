import { Pipe, PipeTransform } from '@angular/core';

// models
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { ITruckModalConfigPipeArgs } from '@pages/truck/pages/truck-modal/interfaces';

@Pipe({
    standalone: true,
    name: 'truckModalInputConfig',
})
export class TruckModalInputConfigPipe implements PipeTransform {
    constructor() {}

    transform(args: ITruckModalConfigPipeArgs): ITaInput {
        const {
            configType,
            loadingVinDecoder,
            type,
            truckLogoName,
            truckTypeName,
            color,
            isFuelTypeEnabled,
            selectedTollTransponders,
        } = args;

        let inputConfig: ITaInput;

        switch (configType) {
            case 'yearInputConfig':
                inputConfig = {
                    name: 'Year',
                    type: 'text',
                    label: 'Year',
                    isRequired: true,
                    minLength: 4,
                    maxLength: 4,
                };
                break;
            case 'vinInputConfig':
                inputConfig = {
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
                        isLoading: loadingVinDecoder,
                    },
                };
                break;
            case 'truckNumberInputConfig':
                inputConfig = {
                    name: 'vehicle-unit',
                    type: 'text',
                    label: 'Unit No.',
                    isRequired: true,
                    textTransform: 'uppercase',
                    minLength: 1,
                    maxLength: 8,
                    autoFocus: type !== 'edit',
                };
                break;
            case 'truckTypeIdInputConfig':
                inputConfig = {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Type',
                    isRequired: true,
                    isDropdown: true,
                    dropdownImageInput: {
                        withText: true,
                        svg: true,
                        image: false,
                        url:
                            truckLogoName &&
                            'assets/svg/common/trucks/' + truckLogoName,
                        template: 'truck',
                        class: truckTypeName
                            ?.trim()
                            .replace(' ', '')
                            .toLowerCase(),
                    },
                    dropdownWidthClass:
                        truckTypeName === 'Box Truck' ||
                        truckTypeName === 'Reefer Truck'
                            ? 'w-col-212'
                            : 'w-col-294',
                    customClass: 'truck-trailer-dropdown',
                };
                break;
            case 'truckMakeInputConfig':
                inputConfig = {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Make',
                    isRequired: true,
                    isDropdown: true,
                    dropdownImageInput: {
                        withText: false,
                        svg: true,
                        image: false,
                        url: truckLogoName,
                        class: 'truck-make',
                    },
                    dropdownWidthClass: 'w-col-156',
                };
                break;
            case 'truckColorInputConfig':
                inputConfig = {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Color',
                    isDropdown: true,
                    dropdownImageInput: {
                        withText: true,
                        svg: true,
                        image: false,
                        url: color ? 'ic_color.svg' : null,
                        template: 'color',
                        color: color,
                    },
                    dropdownWidthClass: 'w-col-163',
                };
                break;
            case 'truckFuelInputConfig':
                inputConfig = {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Fuel Type',
                    isDropdown: true,
                    dropdownWidthClass: 'w-col-164',
                    isDisabled: !isFuelTypeEnabled,
                };
                break;
            case 'tollTransponderDeviceNoConfig':
                inputConfig = {
                    name: 'Device No',
                    type: 'text',
                    label: 'Device No.',
                    isDisabled: !selectedTollTransponders,
                };
                break;
            default:
                return;
        }

        return inputConfig;
    }
}
