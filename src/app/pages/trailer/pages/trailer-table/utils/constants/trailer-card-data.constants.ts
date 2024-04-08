import { CardRows } from 'src/app/shared/models/card-models/card-rows.model';

export class trailerCardDataConstants {
    static rows: number = 4;

    static page: string = 'Trailer';

    static cardTitle: string = 'trailerNumber';

    // Data for active trucks front
    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'VIN No.',
            key: 'tableVin.regularText',
            secondKey: 'tableVin.boldText',
        },
        {
            title: 'Make',
            key: 'trailerMake.name',
        },
        {
            title: 'Model',
            key: 'tableModel',
        },
        {
            title: 'Owner',
            key: 'owner.name',
        },
    ];

    // Data for active trucks back
    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Length',
            key: 'tabelLength',
        },
        {
            title: 'Color',
            key: 'color.code',
            secondKey: 'color.name',
        },
        {
            title: 'Licence Exp.',
            key: 'tableLicencePlateDetailExpiration.expirationDaysText',
            secondKey: 'tableLicencePlateDetailExpiration.percentage',
        },
        {
            title: 'FHWA Exp.',
            key: 'tableFHWAInspectionExpiration.expirationDaysText',
            secondKey: 'tableFHWAInspectionExpiration.percentage',
        },
    ];

    // Data for inactive trucks
    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'VIN No.',
            key: 'tableVin.regularText',
            secondKey: 'tableVin.boldText',
        },
        {
            title: 'Make',
            key: 'truckMake.name',
        },
        {
            title: 'Model',
            key: 'model',
        },
        {
            title: 'Mileage',
            key: 'mileage',
        },
    ];

    // Data for shipper
    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Type',
            key: 'truckType.name',
        },
        {
            title: 'Licence No.',
            key: 'licensePlate',
        },
        {
            title: 'Licence Exp.',
            key: 'tableLicencePlateDetailExpiration.expirationDaysText',
            secondKey: 'tableLicencePlateDetailExpiration.percentage',
        },
        {
            title: 'FHWA Exp.',
            key: 'tableFhwaInspectionExpiration.expirationDaysText',
            secondKey: 'tableFhwaInspectionExpiration.percentage',
        },
    ];
}
