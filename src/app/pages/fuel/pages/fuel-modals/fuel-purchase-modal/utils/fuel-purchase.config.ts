import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class FuelPurchaseConfig {
    static getTransactionDate(
        editDataType: string,
        fuelTransactionTypeName: string
    ): ITaInput {
        return {
            name: 'datepicker',
            type: 'text',
            label: 'Date',
            placeholderIcon: 'date',
            isRequired: true,
            isDropdown: true,
            isDisabled:
                editDataType === 'edit' && fuelTransactionTypeName !== 'Manual',
            customClass: 'datetimeclass',
        };
    }

    static getTransactionTime(
        editDataType: string,
        fuelTransactionTypeName: string
    ): ITaInput {
        return {
            name: 'timepicker',
            type: 'text',
            label: 'Time',
            placeholderIcon: 'time',
            isDropdown: true,
            isRequired: true,
            isDisabled:
            editDataType === 'edit' && fuelTransactionTypeName !== 'Manual',
            customClass: 'datetimeclass',
        };
    }

    static getTrailerInputConfig(logoName: string): ITaInput  {
        return {
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
        }
    }

    static getTruckInputConfig(selectedTruckType: { logoName: string, name: string }, trailerId: any): ITaInput {
        return {
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
        }
    }

    static EFS_INPUT_CONFIG: ITaInput = {
        name: 'EFS Account',
        type: 'text',
        label: 'EFS Account',
        isDisabled: true,
    };

    static FUEL_CARD_INPUT_CONFIG: ITaInput = {
        name: 'Fuel Card',
        type: 'text',
        label: 'Fuel Card',
        isDisabled: true,
        placeholderIcon: 'fuel-card',
    };

    static INVOICE_INPUT_CONFIG: ITaInput = {
        name: 'Invoice',
        type: 'text',
        label: 'Invoice',
        textTransform: 'uppercase',
        isRequired: true,
        minLength: 1,
        maxLength: 22,
    };

    static DRIVER_NAME_INPUT_CONFIG: ITaInput = {
        name: 'Full name',
        type: 'text',
        label: 'Driver',
        isDisabled: true,
        textTransform: 'capitalize',
        minLength: 2,
        maxLength: 32,
    }
}
