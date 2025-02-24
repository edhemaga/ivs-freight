// models
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class ShipperModalConfig {
    static getAddressUnitInputConfig(): ITaInput {
        return {
            name: 'address-unit',
            type: 'text',
            label: 'Unit #',
            textTransform: 'uppercase',
            minLength: 1,
            maxLength: 10,
        };
    }

    static getLongitudeInputConfig(): ITaInput {
        return {
            name: 'longitude',
            type: 'text',
            label: 'Longitude',
            placeholderIcon: 'coordinates',
            textTransform: 'uppercase',
            isRequired: true,
            minLength: 1,
            maxLength: 10,
        };
    }

    static getLatitudeInputConfig(): ITaInput {
        return {
            name: 'latitude',
            type: 'text',
            label: 'Latitude',
            placeholderIcon: 'coordinates',
            textTransform: 'uppercase',
            isRequired: true,
            minLength: 1,
            maxLength: 10,
        };
    }

    static getCountryStateInputConfig(): ITaInput {
        return {
            name: 'countryState',
            type: 'text',
            label: 'County, State',
            isDisabled: true,
            isRequired: false,
            placeholderIcon: 'address',
            textTransform: 'capitalize',
            dropdownWidthClass: 'w-col-297',
            minLength: 6,
            maxLength: 256,
        };
    }
}
