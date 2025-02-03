import { CardRows } from '@shared/models/card-models/card-rows.model';

export class TruckCardDataConstants {
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
