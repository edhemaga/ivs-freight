import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class LoadModalConfig {
    static LOAD_DISPATCHES_TTD_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Truck', 'Trailer', 'Driver', 'Driver Pay'],
            customClass: 'load-dispatches-ttd',
        },
        isDropdown: true,
        blackInput: true,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-616',
    };

    static LOAD_BROKER_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Broker', 'Avail. Credit', 'Loads'],
            customClass: 'load-broker',
        },
        isDropdown: true,
        isRequired: true,
        blackInput: true,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-432',
    };

    static LOAD_BROKER_CONTACTS_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Contact', 'Phone'],
            customClass: 'load-broker-contact',
        },
        isDropdown: true,
        isDisabled: true,
        blackInput: true,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-330',
    };

    static LOAD_PICKUP_SHIPPER_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Shipper', 'City, State, Zip', 'Loads'],
            customClass: 'load-shipper',
        },
        isDropdown: true,
        isRequired: true,
        blackInput: true,
        textTransform: 'uppercase',
        dropdownWidthClass: 'w-col-608',
    };

    static LOAD_PICKUP_SHIPPER_CONTACTS_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Contact', 'Phone'],
            customClass: 'load-shipper-contact',
        },
        isDropdown: true,
        isDisabled: true,
        blackInput: true,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-330',
    };

    static LOAD_DELIVERY_SHIPPER_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Shipper', 'City, State, Zip', 'Loads'],
            customClass: 'load-shipper',
        },
        isDropdown: true,
        isRequired: true,
        blackInput: true,
        textTransform: 'uppercase',
        dropdownWidthClass: 'w-col-608',
    };

    static LOAD_DELIVERY_SHIPPER_CONTACTS_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Contact', 'Phone'],
            customClass: 'load-shipper-contact',
        },
        isDropdown: true,
        isDisabled: true,
        blackInput: true,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-330',
    };
}
