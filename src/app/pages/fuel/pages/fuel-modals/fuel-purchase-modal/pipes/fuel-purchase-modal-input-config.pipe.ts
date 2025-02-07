import { Pipe, PipeTransform } from '@angular/core';

// models
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { FuelPurchaseModalConfigPipeArgs } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/models';

@Pipe({
    standalone: true,
    name: 'fuelPurchaseModalInputConfig',
})
export class FuelPurchaseModalInputConfigPipe implements PipeTransform {
    transform(args: FuelPurchaseModalConfigPipeArgs): ITaInput {
        const {
            configType,
            editDataType,
            fuelTransactionTypeName,
            fuelCardHolderName,
            selectedTruckType,
            selectedDriver,
            trailerId,
            logoName,
        } = args;

        let inputConfig: ITaInput;

        switch (configType) {
            case 'efsInputConfig':
                inputConfig = {
                    name: 'EFS Account',
                    type: 'text',
                    label: 'EFS Account',
                    isDisabled: true,
                };

                break;
            case 'fuelCardInputConfig':
                inputConfig = {
                    name: 'Fuel Card',
                    type: 'text',
                    label: 'Fuel Card',
                    isDisabled: true,
                    placeholderIcon: 'fuel_card',
                };

                break;
            case 'invoiceInputConfig':
                inputConfig = {
                    name: 'Invoice',
                    type: 'text',
                    label: 'Invoice',
                    textTransform: 'uppercase',
                    isRequired: true,
                    minLength: 1,
                    maxLength: 22,
                };

                break;
            case 'driverInputConfig':
                inputConfig = {
                    name: 'Full name',
                    type: 'text',
                    label: 'Driver',
                    isDisabled: true,
                    textTransform: 'capitalize',
                    minLength: 2,
                    maxLength: 32,
                };

                break;
            case 'transactionDateInputConfig':
                inputConfig = {
                    name: 'datepicker',
                    type: 'text',
                    label: 'Date',
                    placeholderIcon: 'date',
                    isRequired: true,
                    isDropdown: true,
                    isDisabled:
                        editDataType === 'edit' &&
                        fuelTransactionTypeName !== 'Manual',
                    customClass: 'datetimeclass',
                };

                break;
            case 'transactionTimeInputConfig':
                inputConfig = {
                    name: 'timepicker',
                    type: 'text',
                    label: 'Time',
                    placeholderIcon: 'time',
                    isDropdown: true,
                    isRequired: true,
                    isDisabled:
                        editDataType === 'edit' &&
                        fuelTransactionTypeName !== 'Manual',
                    customClass: 'datetimeclass',
                };

                break;
            case 'truckInputConfig':
                inputConfig = {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Truck',
                    isDropdown: true,
                    isRequired: true,
                    dropdownImageInput: {
                        withText: true,
                        svg: true,
                        image: false,
                        url: selectedTruckType?.logoName,
                        template: 'truck',
                        class: selectedTruckType?.name
                            ?.trim()
                            .replace(' ', '')
                            .toLowerCase(),
                    },
                    dropdownWidthClass: !trailerId
                        ? 'w-col-216 truck-trailer-dropdown'
                        : 'w-col-143 truck-trailer-dropdown',
                    customClass: 'truck-trailer-dropdown',
                };

                break;
            case 'driverDropdownInputConfig':
                const { avatarFile } = selectedDriver || {};
                console.log(fuelCardHolderName);

                inputConfig = {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Driver',
                    isDropdown: true,
                    isRequired: true,
                    placeholder: fuelCardHolderName ?? 'Driver',
                    dropdownImageInput: {
                        withText: true,
                        svg: true,
                        image: false,
                        url: avatarFile?.url,
                        template: 'user-avatar',
                        class: 'classtest'
                    },
                    dropdownWidthClass: 'w-col-216',
                    customClass: 'truck-trailer-dropdown',
                };

                break;
            case 'trailerInputConfig':
                inputConfig = {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Trailer',
                    isRequired: true,
                    isDropdown: true,
                    dropdownImageInput: {
                        withText: true,
                        svg: true,
                        image: false,
                        url: logoName,
                        template: 'trailer',
                    },
                    dropdownWidthClass: 'w-col-216',
                    customClass: 'truck-trailer-dropdown',
                    isDisabled: true,
                };

                break;
            default:
                return;
        }

        return inputConfig;
    }
}
