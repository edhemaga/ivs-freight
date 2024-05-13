import { CardRows } from '@shared/models/card-models/card-rows.model';

export class TruckCardDataConstants {
    static rows: number = 4;

    static page: string = 'Truck';

    static cardTitle: string = 'truckNumber';

    // Data for active trucks front
    static displayRowsFrontActive: CardRows[] = [
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

    // Data for active trucks back
    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Owner',
            key: 'owner.name',
        },
        {
            title: 'Commission',
            key: 'tabelOwnerDetailsComm',
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
