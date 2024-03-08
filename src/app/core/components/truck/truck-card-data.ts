import { CardRows } from '../shared/model/card-data.model';
export class DisplayTruckConfiguration {
    static rows: number = 4;

    static page: string = 'Truck';

    static cardTitle: string = 'truckNumber';

    // Data for active trucks front
    static displayRowsFrontActive: CardRows[] = [
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

    // Data for active trucks back
    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Owner',
            endpoint: 'owner.name',
        },
        {
            title: 'Commission',
            endpoint: 'tabelOwnerDetailsComm',
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
