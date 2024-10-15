import { CardRows } from '@shared/models/card-models/card-rows.model';

export class TrailerCardsModalConfig {
    static rows: number = 4;

    static page: string = 'trailer';

    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'VIN',
            key: 'tableVin',
            secondKey: 'regularText',
            thirdKey: 'boldText',
        },
        {
            title: 'Make',
            key: 'tableMake',
        },
        {
            title: 'Model',
            key: 'tableModel',
        },
        {
            title: 'Length',
            key: 'tabelLength',
        },
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Year',
            key: 'year',
        },
        {
            title: 'Color',
            key: 'color',
            secondKey: 'code',
            thirdKey: 'name',
        },
        {
            title: 'Licence Exp.',
            key: 'tableLicencePlateDetailExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        {
            title: 'FHWA Exp.',
            key: 'tableFHWAInspectionExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        null,
        null,
    ];

    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'VIN',
            key: 'tableVin',
            secondKey: 'regularText',
            thirdKey: 'boldText',
        },
        {
            title: 'Make',
            key: 'tableMake',
        },
        {
            title: 'Model',
            key: 'tableModel',
        },
        {
            title: 'Length',
            key: 'tabelLength',
        },
        null,
        null,
    ];

    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Year',
            key: 'year',
        },
        {
            title: 'Color',
            key: 'color',
            secondKey: 'code',
            thirdKey: 'name',
        },
        {
            title: 'Licence Exp.',
            key: 'tableLicencePlateDetailExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        {
            title: 'FHWA Exp.',
            key: 'tableFHWAInspectionExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        null,
        null,
    ];
}
