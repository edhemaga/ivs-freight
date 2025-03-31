export const inputConfig = {
    name: 'price-separator',
    type: 'text',
    label: 'Amount',
    isRequired: true,
    priceSeparator: true,
    priceSeparatorLimitation: 6,
    placeholderIcon: 'dollar',
    placeholderIconColor: 'blue',
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
        name: 'Wire Transfer',
        value: 'WireTransfer',
    },
    {
        id: 2,
        companyId: null,
        name: 'Cash',
        value: 'Cash',
    },
    {
        id: 3,
        companyId: null,
        name: 'Check',
        value: 'Check',
    },
    {
        id: 4,
        companyId: null,
        name: 'Money Code',
        value: 'MoneyCode',
    },
    {
        id: 5,
        companyId: null,
        name: 'Quick (Zelle)',
        value: 'QuickZelle',
    },
    {
        id: 6,
        companyId: null,
        name: 'Quick (Venmo)',
        value: 'QuickVenmo',
    },
    {
        id: 7,
        companyId: null,
        name: 'Quick (Cashapp)',
        value: 'QuickCashapp',
    },
    {
        id: 8,
        companyId: null,
        name: 'Quick (Paypal)',
        value: 'QuickPaypal',
    },
];
