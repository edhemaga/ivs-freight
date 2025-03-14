import { Pipe, PipeTransform } from '@angular/core';

// models
import { FuelPurchaseModalConfigPipeArgs } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/models';

// enums
import { NameInitialsPipe } from '@shared/pipes';
import { eGeneralActions } from '@shared/enums';

// config
import { ICaInput } from '@ca-shared/components/ca-input/config';

@Pipe({
    standalone: true,
    name: 'fuelPurchaseModalInputConfig',
})
export class FuelPurchaseModalInputConfigPipe implements PipeTransform {
    constructor(private nameInitialsPipe: NameInitialsPipe) {}

    transform(args: FuelPurchaseModalConfigPipeArgs): ICaInput {
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

        let inputConfig: ICaInput;
        const truckTrailerDriverDropdownWidth: string = trailerId
            ? 'w-col-143'
            : 'w-col-220';

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
                        editDataType === eGeneralActions.EDIT &&
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
                        editDataType === eGeneralActions.EDIT &&
                        fuelTransactionTypeName !== 'Manual',
                    customClass: 'datetimeclass',
                };

                break;
            case 'truckInputConfig':
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
                        iconsPath: 'assets/svg/common/trucks/',
                        activeItemIconKey: 'logoName',
                        template: 'truck',
                        class: selectedTruckType?.name
                            ?.trim()
                            .replace(' ', '')
                            .toLowerCase(),
                    },
                    dropdownWidthClass: truckTrailerDriverDropdownWidth,
                    customClass: 'truck-trailer-dropdown',
                };

                break;
            case 'driverDropdownInputConfig':
                const { logoName: driverLogoName } = selectedDriver || {};
                const initials: string = this.nameInitialsPipe.transform(
                    driverLogoName ?? fuelCardHolderName
                );

                inputConfig = {
                    name: 'Input Dropdown',
                    type: 'text',
                    label: 'Driver',
                    isDropdown: true,
                    dropdownWidthClass: truckTrailerDriverDropdownWidth,
                    dropdownImageInput: {
                        withText: true,
                        svg: false,
                        image: true,
                        url: driverLogoName,
                        // TODO: waiting for CAR-3201 to be done
                        // nameInitialsInsteadUrl: driverLogoName ? null : initials,
                        template: 'user',
                    } as any,
                    isBlueDropdown: true,
                    isRequired: true,
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
                    dropdownWidthClass: truckTrailerDriverDropdownWidth,
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
