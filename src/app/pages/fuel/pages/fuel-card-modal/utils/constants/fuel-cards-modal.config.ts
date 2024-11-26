import { CardRows } from '@shared/models/card-models/card-rows.model';

export class FuelCardsModalConfig {
    static rows: number = 4;

    static page: string = 'fuel';

    static displayRowsFrontActive: CardRows[] = [
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
            secondTitle: 'Title Cost',
            key: 'fuelStopStore',
            secondKey: 'totalCost',
            prefix: '$',
        },
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
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
        null,
        null,
    ];

    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'Phone',
            key: 'phone',
        },
        {
            title: 'Fax',
            key: 'fax',
        },
        {
            title: 'Address',
            key: 'tableAddress',
        },

        {
            title: 'Expense',
            key: 'tableExpense',
        },
        null,
        null,
    ];

    static displayRowsBackInactive: CardRows[] = [
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
        null,
        null,
    ];
}
