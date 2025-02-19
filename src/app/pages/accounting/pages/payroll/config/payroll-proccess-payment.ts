export const inputConfig = {
    name: 'price-separator',
    type: 'text',
    label: 'Amount',
    isRequired: true,
    priceSeparator: true,
    priceSeparatorLimitation: 6,
    placeholderIcon: 'dollar',
    placeholderIconColor: 'blue'
};

export const dropDownInputConfig = {
    name: 'Input Dropdown',
    type: 'text',
    label: 'Pay Method',
    isDropdown: true,
    dropdownWidthClass: 'w-col-222',
    isRequired: true,
};

export const dropdownOption = [
    {
        id: 1,
        companyId: null,
        name: 'WireTransfer',
        value: 'WireTransfer'
    },
    {
        id: 2,
        companyId: null,
        name: 'Cash',
        value: 'Cash'
    },
    {
        id: 3,
        companyId: null,
        name: 'MoneyCode',
        value: 'MoneyCode'
    },
    {
        id: 4,
        companyId: null,
        name: 'QuickZelle',
        value: 'QuickZelle'
    },
    {
        id: 5,
        companyId: null,
        name: 'QuickVenmo',
        value: 'QuickVenmo'
    },
    {
        id: 6,
        companyId: null,
        name: 'QuickCashapp',
        value: 'QuickCashapp'
    },
    {
        id: 7,
        companyId: null,
        name: 'QuickPaypal',
        value: 'QuickPaypal'
    }
];