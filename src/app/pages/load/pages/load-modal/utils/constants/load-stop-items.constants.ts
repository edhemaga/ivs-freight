// models
import { LoadItemStop } from '@pages/load/pages/load-modal/models/load-item-stop.model';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class LoadStopItems {
    static DESCRIPTION_INPUT_CONFIG: ITaInput = {
        name: 'Description',
        type: 'text',
        label: 'Description',
        placeholderInsteadOfLabel: true,
        isRequired: true,
        hideErrorMessage: true,
    };

    static QUANTITY_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        isDropdown: true,
        label: 'Quantity',
        placeholderInsteadOfLabel: true,
        dropdownWidthClass: 'w-col-130',
    };

    static BOL_INPUT_CONFIG: ITaInput = {
        name: 'BOL NO',
        type: 'text',
        label: 'BOL NO',
        placeholderInsteadOfLabel: true,
    };
    static WEIGHT_INPUT_CONFIG: ITaInput = {
        name: 'Weight',
        type: 'text',
        label: 'Weight',
        placeholderInsteadOfLabel: true,
        fixedPlacholder: 'lbs',
    };

    static LENGTH_INPUT_CONFIG: ITaInput = {
        name: 'Length',
        type: 'text',
        label: 'Length',
        placeholderInsteadOfLabel: true,
        fixedPlacholder: 'ft',
    };
    static HEIGHT_INPUT_CONFIG: ITaInput = {
        name: 'Height',
        type: 'text',
        label: 'Height',
        placeholderInsteadOfLabel: true,
        fixedPlacholder: 'ft',
    };
    static TARP_INPUT_CONFIG: ITaInput = {
        name: 'Tarp',
        type: 'text',
        isDropdown: true,
        label: 'Tarp',
        placeholderInsteadOfLabel: true,
        dropdownWidthClass: 'w-col-130',
    };

    static SECURE_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        isDropdown: true,
        label: 'Secure',
        placeholderInsteadOfLabel: true,
        dropdownWidthClass: 'w-col-100',
    };

    static PICKUP_INPUT_CONFIG: ITaInput = {
        name: 'Pickup No.',
        type: 'text',
        label: 'Pickup No.',
        placeholderInsteadOfLabel: true,
    };

    static CODE_INPUT_CONFIG: ITaInput = {
        name: 'Code',
        type: 'text',
        label: 'Code',
        placeholderInsteadOfLabel: true,
    };

    static SEAL_NUMBER_INPUT_CONFIG: ITaInput = {
        name: 'Seal No.',
        type: 'text',
        label: 'Seal No.',
        placeholderInsteadOfLabel: true,
    };

    static STACKABLE_INPUT_CONFIG: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        isDropdown: true,
        label: 'Stack',
        placeholderInsteadOfLabel: true,
        dropdownWidthClass: 'w-col-80',
    };
    static TEMPERATURE_INPUT_CONFIG: ITaInput = {
        name: 'TMP',
        type: 'text',
        label: 'TMP',
        placeholderInsteadOfLabel: true,
    };

    static IS_CREATED_NEW_STOP_ITEMS_ROW: LoadItemStop = {
        pickup: false,
        delivery: false,
        extraStops: [],
    };
}
