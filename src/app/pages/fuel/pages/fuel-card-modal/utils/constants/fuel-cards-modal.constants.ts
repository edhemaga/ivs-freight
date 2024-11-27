import { CardRows } from '@shared/models/card-models/card-rows.model';

export class FuelCardsModalData {
    static frontDataLoad: CardRows[] = [
        {
            title: 'Date & Time',
            key: 'tableTransactionDate',
        },
        {
            title: 'Truck No.',
            key: 'tableTruckNumber',
        },
        {
            title: 'Item Detail • Description',
            key: 'descriptionItems',
        },
        {
            title: 'Item Detail • Total Cost',
            key: 'tabelDescriptionDropTotal',
        },
    ];
    static backDataLoad: CardRows[] = [
        {
            title: 'Fuel Stop Detail • Name',
            key: 'tableFuelStopName',
        },
        {
            title: 'Fuel Stop Detail • Location',
            key: 'tableLocation',
        },
        {
            title: 'Driver',
            key: 'driver',
        },
        {
            title: 'Card Detail • Number',
            key: 'TableDropdownComponentConstantsCardNumber',
        },
    ];

    static allDataFuelTransaction: CardRows[] = [
        {
            title: 'Date & Time',
            key: 'tableTransactionDate',
        },
        {
            title: 'Truck No.',
            key: 'tableTruckNumber',
        },
        {
            title: 'Trailer No.',
            key: 'trailer',
            secondKey: 'trailerNumber',
        },
        {
            title: 'Driver',
            key: 'driver',
        },
        {
            isDropdown: true,
            title: 'Card Detail',
            values: [
                {
                    title: 'Card Detail • Number',
                    secondTitle: 'Card No.',
                    key: 'TableDropdownComponentConstantsCardNumber',
                },
                {
                    title: 'Card Detail • Type',
                    secondTitle: 'Type',
                    key: '',
                },
                {
                    title: 'Card Detail • Account',
                    secondTitle: 'Account No.',
                    key: '',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Fuel Stop Detail',
            values: [
                {
                    title: 'Fuel Stop Detail • Name',
                    secondTitle: 'Name',
                    key: 'tableFuelStopName',
                },
                {
                    title: 'Fuel Stop Detail • Phone',
                    secondTitle: 'Phone',
                    key: 'fuelStopStore',
                    secondKey: 'phone',
                },
                {
                    title: 'Fuel Stop Detail • Fax',
                    secondTitle: 'Fax',
                    key: 'fuelStopStore',
                    secondKey: 'fax',
                },
                {
                    title: 'Fuel Stop Detail • Location',
                    secondTitle: 'Location',
                    key: 'tableLocation',
                },
                {
                    title: 'Fuel Stop Detail • Address',
                    secondTitle: 'Address',
                    key: 'tableAddress',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Item Detail',
            values: [
                {
                    title: 'Item Detail • Description',
                    secondTitle: 'Description',
                    key: 'descriptionItems',
                },
                {
                    title: 'Item Detail • Gallon',
                    secondTitle: 'Gallon',
                    key: 'tableGallon',
                    sufix: ' gal'
                },
                {
                    title: 'Item Detail • Price per Gal.',
                    secondTitle: 'Price per Gal.',
                    key: 'tablePPG',
                    prefix: '$',
                },
                {
                    title: 'Item Detail • Total Cost',
                    secondTitle: 'Title Cost',
                    key: 'fuelStopStore',
                    secondKey: 'totalCost',
                    prefix: '$',
                },
            ],
        },
        {
            title: 'Date Added',
            key: 'tableAdded',
        },
        {
            title: 'Date Edited',
            key: 'tableEdited',
        },
    ];

    static allDataFuelStop: CardRows[] = [
        {
            title: 'Phone',
            key: 'phone',
        },
        {
            title: 'Fax',
            key: 'fax',
        },
        {
            title: 'Location',
            key: 'tableLocation',
        },
        {
            title: 'Address',
            key: 'tableAddress',
        },
        {
            title: 'Times Used',
            key: 'tableUsed',
        },
        {
            title: 'Price Range',
            key: 'tablePriceRange',
        },
        {
            title: 'Last Price',
            key: 'commission',
            sufix: '%',
        },
        {
            title: 'Last Visit',
            key: 'salary',
            type: 'money',
        },
        {
            title: 'Expense',
            key: 'tableExpense',
        },
        {
            title: 'Date Deactivated',
            key: 'tableDeactivated',
        },
        {
            title: 'Date Added',
            key: 'tableAdded',
        },
        {
            title: 'Date Edited',
            key: 'tableEdited',
        },
    ];
}
