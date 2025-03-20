export class TruckModalInputConfig {
    static TRUCK_LENGTH_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Length',
        isDropdown: true,
        isRequired: true,
        dropdownWidthClass: 'w-col-100',
    };

    static TRUCK_MAKE_INPUT = {
        name: 'truck-trailer-model',
        type: 'text',
        label: 'Model',
        isRequired: true,
        textTransform: 'uppercase',
        minLength: 1,
        maxLength: 50,
    };

    static OWNER_TYPE_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Owner',
        isRequired: true,
        isDropdown: true,
        dropdownWidthClass: 'w-col-456',
    };

    static TRUCK_GROSS_WEIGHT_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Gross Weight',
        isDropdown: true,
        dropdownWidthClass: 'w-col-196',
    };

    static TRUCK_VOLUME_INPUT = {
        name: 'trailer-volume',
        type: 'text',
        label: 'Volume',
        maxLength: 5,
        priceSeparator: true,
    };

    static TRUCK_EMPTY_WEIGHT_INPUT = {
        name: 'Empty Weight',
        type: 'text',
        label: 'Empty Weight',
        maxLength: 5,
        placeholderText: 'ibs',
        thousandSeparator: true,
    };

    static TRUCK_ENGINE_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Engine Model',
        isDropdown: true,
        dropdownWidthClass: 'w-col-196',
    };

    static TRUCK_ENGINE_OIL_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Engine Oil Type',
        isDropdown: true,
        dropdownWidthClass: 'w-col-248',
    };

    static FUEL_TANK_INPUT = {
        name: 'Fuel Tank Size',
        type: 'text',
        label: 'Fuel Tank Size',
        thousandSeparator: true,
    };

    static AP_UNIT_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'AP Unit',
        isDropdown: true,
        dropdownWidthClass: 'w-col-134',
    };

    static TRANSMISSION_MODEL_INPUT = {
        name: 'Transmission Model',
        type: 'text',
        label: 'Transmission Model',
    };

    static SHIFTER_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Shifter',
        isDropdown: true,
        dropdownWidthClass: 'w-col-134',
    };

    static GEAR_RATIO_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Gear Ratio',
        isDropdown: true,
        dropdownWidthClass: 'w-col-135',
    };

    static TIRE_SIZE_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Tire Size',
        isDropdown: true,
        dropdownWidthClass: 'w-col-164',
    };

    static AXLES_INPUT = {
        name: 'Axles',
        type: 'number',
        label: 'Axle',
    };

    static BRAKES_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Brakes',
        isDropdown: true,
        dropdownWidthClass: 'w-col-134',
    };

    static WHEEL_BASE_INPUT = {
        name: 'Wheel Basee',
        type: 'text',
        label: 'Wheel Base',
        maxLength: 8,
        thousandSeparator: true,
    };

    static FRONT_WHEELS_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Front Wheels',
        isDropdown: true,
        dropdownWidthClass: 'w-col-134',
    };

    static REAR_WHEELS_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Rear Wheels',
        isDropdown: true,
        dropdownWidthClass: 'w-col-134',
    };

    static TOLL_INPUT = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Toll Transponder',
        isDropdown: true,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-196',
    };

    static INSURANCE_POLICY_INPUT = {
        name: 'insurance-policy',
        type: 'text',
        label: 'Insurance Policy',
        maxLength: 14,
        textTransform: 'uppercase',
    };

    static MILEAGE_INPUT = {
        name: 'Mileage',
        type: 'text',
        label: 'Mileage',
        maxLength: 8,
        placeholderText: 'mi',
        thousandSeparator: true,
    };

    static FHWA_INPUT = {
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

    static PURCHASE_DATE_INPUT = {
        name: 'datepicker',
        type: 'text',
        label: 'Purchase Date',
        isDropdown: true,
        placeholderIcon: 'date',
        customClass: 'datetimeclass',
        isFutureDateDisabled: true,
    };

    static PURCHASE_PRICE_INPUT = {
        name: 'Purchase Price',
        type: 'text',
        label: 'Purchase Price',
        maxLength: 14,
        thousandSeparator: true,
        placeholderIcon: 'dollar',
    };
}
