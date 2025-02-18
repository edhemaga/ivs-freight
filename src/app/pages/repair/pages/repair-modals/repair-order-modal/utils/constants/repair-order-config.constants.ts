import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

export class RepairOrderConfig {
    static INVOICE: ITaInput = {
        name: 'Invoice',
        type: 'text',
        label: 'Invoice',
        textTransform: 'uppercase',
        isRequired: true,
        minLength: 1,
        maxLength: 22,
    };

    static DATE: ITaInput = {
        name: 'datepicker',
        type: 'text',
        isDropdown: true,
        label: 'Date',
        placeholderIcon: 'date',
        isRequired: true,
        customClass: 'datetimeclass',
    };

    static PAY_TYPE: ITaInput = {
        name: 'payType',
        type: 'text',
        label: 'Pay Type',
        isDropdown: true,
        textTransform: 'uppercase',
        minLength: 1,
        maxLength: 8,
        dropdownWidthClass: 'w-col-145',
    };

    static DATE_PAID = (selectedPayType: boolean): ITaInput => {
        return {
            name: 'datepicker',
            type: 'text',
            isDropdown: true,
            label: 'Date Paid',
            placeholderIcon: 'date',
            isDisabled: !selectedPayType,
            isRequired: selectedPayType,
            customClass: 'datetimeclass',
        };
    };

    static ORDER_NUMBER: ITaInput = {
        name: 'Order No.',
        type: 'text',
        label: 'Order No.',
        textTransform: 'uppercase',
        isRequired: true,
        minLength: 1,
        maxLength: 9,
    };

    static UNIT: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Unit',
        isDropdown: true,
        isRequired: true,
        dropdownWidthClass: 'w-col-145 truck-trailer-dropdown',
        customClass: 'truck-trailer-dropdown',
    };

    static DRIVER = (isDriverDisabled: boolean): ITaInput => {
        return {
            name: 'driver',
            type: 'text',
            label: 'Driver',
            isDropdown: true,
            isDisabled: isDriverDisabled,
            textTransform: 'capitalize',
            minLength: 1,
            maxLength: 8,
            dropdownWidthClass: 'w-col-145',
            hideClear: true,
        };
    };

    static ODOMETER = (
        selectedHeaderTab: number,
        isAnyRepairItemHasPmSelected: boolean
    ): ITaInput => {
        return {
            name: 'repair-odometer',
            type: 'text',
            label: 'Odometer',
            isDisabled: selectedHeaderTab !== 1,
            isRequired: isAnyRepairItemHasPmSelected,
            thousandSeparator: true,
            minLength: 1,
            maxLength: 9,
        };
    };

    static REPAIR_SHOP = (selectedHeaderTab: number): ITaInput => {
        return {
            name: 'Input Dropdown',
            type: 'text',
            label: 'Repair Shop',
            isDropdown: true,
            isRequired: selectedHeaderTab === 1,
            dropdownWidthClass: 'w-col-616',
        };
    };
}
