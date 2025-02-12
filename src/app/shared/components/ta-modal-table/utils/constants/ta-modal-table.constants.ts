export class ModalTableConstants {
    static PHONE_TABLE_HEADER_ITEMS: string[] = [
        '#',
        'PHONE NO',
        'EXT',
        'TYPE',
    ];

    static EMAIL_TABLE_HEADER_ITEMS: string[] = ['#', 'EMAIL', 'TYPE'];

    static REPAIR_BILL_TABLE_HEADER_ITEMS = [
        '#',
        'DESCRIPTION',
        'PM',
        'QTY',
        'PRICE',
        'SUBTOTAL',
    ];

    static REPAIR_ORDER_TABLE_HEADER_ITEMS: string[] = [
        '#',
        'DESCRIPTION',
        'PM',
        'QTY',
    ];

    static FUEL_TABLE_HEADER_ITEMS: string[] = [
        '#',
        'ITEM',
        'QTY',
        'PRICE',
        'SUBTOTAL',
    ];

    static CONTACT_TABLE_HEADER_ITEMS: string[] = [
        '#',
        'FULL NAME',
        'DEPARTMENT',
        'PHONE',
        'EXT',
        'EMAIL',
    ];

    static PM_TRUCK_TABLE_HEADER_ITEMS: string[] = [
        'Sort',
        'Checkbox',
        'TITLE',
        'MILES',
    ];

    static PM_TRAILER_TABLE_HEADER_ITEMS: string[] = [
        '#',
        'Checkbox',
        'TITLE',
        'MONTHS',
    ];

    static OFF_DUTY_LOCATION_TABLE_HEADER_ITEMS: string[] = [
        '#',
        'NICKNAME',
        'ADDRESS, CITY, STATE ZIP',
    ];

    static FUEL_CARD_TABLE_HEADER_ITEMS: string[] = [
        '#',
        'CARD NO',
        'PROVIDER',
        'ACCOUNT',
    ];

    static PREVIOUS_ADDRESSES_TABLE_HEADER_ITEMS: string[] = [
        '#',
        'ADDRESS, CITY, STATE ZIP',
        'UNIT',
    ];

    static LOAD_ITEM_TABLE_HEADER_ITEMS: string[] = [
        '#',
        'DESCRIPTION',
        'QUANTITY',
        'TMP',
        'WEIGHT',
        'LENGTH',
        'HEIGHT',
        'TARP',
        'STACK',
        'SECURE',
        'BOL NO',
        'PICKUP NO',
        'SEAL NO',
        'CODE',
    ];

    static DEPARTMENT_CONTACT_TABLE_HEADER_ITEMS: string[] = [
        '#',
        'DEPARTMENT',
        'PHONE',
        'EXT',
        'EMAIL',
    ];

    static IS_INPUT_HOVER_ROW_PHONE: boolean[] = [false, false, false];
    static IS_INPUT_HOVER_ROW_EMAIL: boolean[] = [false, false];
    static IS_INPUT_HOVER_ROW_REPAIR_BILL: boolean[] = [false, false, false];
    static IS_INPUT_HOVER_ROW_REPAIR_ORDER: boolean[] = [false, false];
    static IS_INPUT_HOVER_ROW_FUEL_TRANSACTION: boolean[] = [
        false,
        false,
        false,
    ];
    static IS_INPUT_HOVER_ROW_CONTACT: boolean[] = [false, false, false, false];
    static IS_INPUT_HOVER_ROW_OFF_DUTY_LOCATION: boolean[] = [false, false];
    static IS_INPUT_HOVER_ROW_FUEL_CARD: boolean[] = [false];
    static IS_INPUT_HOVER_ROW_PREVIOUS_ADDRESSES: boolean[] = [false, false];
    static IS_INPUT_HOVER_ROW_LOAD_ITEMS: boolean[] = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ];
    static IS_INPUT_HOVER_ROW_DEPARTMENT_CONTACTS: boolean[] = [
        false,
        false,
        false,
        false,
    ];
}
