export const inputConfig = {
    name: 'price-separator',
    type: 'text',
    label: 'Amount',
    isRequired: true,
    priceSeparator: true,
    priceSeparatorLimitation: 6,
    placeholderIcon: 'dollar',
    placeholderIconColor: 'blue',
    hideErrorMessage: true,
    hideRequiredCheck: true,
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
    },
];