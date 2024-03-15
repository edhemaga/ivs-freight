import { CardRows } from '../shared/model/card-data.model';
export class DisplayTrailerConfiguration {
    static rows: number = 4;

    static page: string = 'Trailer';

    static cardTitle: string = 'trailerNumber';

    // Data for active trucks front
    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'VIN No.',
            endpoint: 'tableVin.regularText',
            secondEndpoint: 'tableVin.boldText',
        },
        {
            title: 'Make',
            endpoint: 'trailerMake.name',
        },
        {
            title: 'Model',
            endpoint: 'tableModel',
        },
        {
            title: 'Owner',
            endpoint: 'owner.name',
        },
    ];

    // Data for active trucks back
    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Length',
            endpoint: 'tabelLength',
        },
        {
            title: 'Color',
            endpoint: 'color.code',
            secondEndpoint: 'color.name',
        },
        {
            title: 'Licence Exp.',
            endpoint: 'tableLicencePlateDetailExpiration.expirationDaysText',
            secondEndpoint: 'tableLicencePlateDetailExpiration.percentage',
        },
        {
            title: 'FHWA Exp.',
            endpoint: 'tableFHWAInspectionExpiration.expirationDaysText',
            secondEndpoint: 'tableFHWAInspectionExpiration.percentage',
        },
    ];

    // Data for inactive trucks
    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'VIN No.',
            endpoint: 'tableVin.regularText',
            secondEndpoint: 'tableVin.boldText',
        },
        {
            title: 'Make',
            endpoint: 'truckMake.name',
        },
        {
            title: 'Model',
            endpoint: 'model',
        },
        {
            title: 'Mileage',
            endpoint: 'mileage',
        },
    ];

    // Data for shipper
    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Type',
            endpoint: 'truckType.name',
        },
        {
            title: 'Licence No.',
            endpoint: 'licensePlate',
        },
        {
            title: 'Licence Exp.',
            endpoint: 'tableLicencePlateDetailExpiration.expirationDaysText',
            secondEndpoint: 'tableLicencePlateDetailExpiration.percentage',
        },
        {
            title: 'FHWA Exp.',
            endpoint: 'tableFhwaInspectionExpiration.expirationDaysText',
            secondEndpoint: 'tableFhwaInspectionExpiration.percentage',
        },
    ];
}
