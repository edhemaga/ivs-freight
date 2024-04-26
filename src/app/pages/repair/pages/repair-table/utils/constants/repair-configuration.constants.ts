import { CardRows } from '@shared/models/card-models/card-rows.model';
export class RepairConfiguration {
    static rows: number = 4;

    static page: string = 'repair';

    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'Date Issued',
            key: 'tableIssued',
        },
        {
            title: 'Unit Detail • Number',
            key: 'tableUnit',
        },
        {
            title: 'Item Detail • Description',
            key: 'items',
        },
        {
            title: 'Item Detail • Cost',
            key: 'total',
        },
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Shop Detail • Name',
            key: 'repairShop',
            secondKey: 'name'
        },
        {
            title: 'Shop Detail • Address',
            key: 'repairShop',
            secondKey: 'address',
            thirdKey: 'address',
        },
        {
            title: 'Unit Detail • Type',
            key: 'unitType.name',
        },
        {
            title: 'Unit Detail • Odometer',
            key: 'odometer',
        },
        null,
        null,
    ];

    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'Date Issued',
            key: 'tableIssued',
        },
        {
            title: 'Unit Detail • Number',
            key: 'tableUnit',
        },
        {
            title: 'Item Detail • Description',
            key: 'items',
        },
        {
            title: 'Item Detail • Cost',
            key: 'total',
        },
    ];

    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Shop Detail • Name',
            key: 'repairShop',
            secondKey: 'name'
        },
        {
            title: 'Shop Detail • Address',
            key: 'repairShop',
            secondKey: 'address',
            thirdKey: 'address',
        },
        {
            title: 'Unit Detail • Type',
            key: 'unitType.name',
        },
        {
            title: 'Unit Detail • Odometer',
            key: 'odometer',
        },
    ];

    static displayRowsFrontShop: CardRows[] = [
        {
            title: 'Vin',
            key: 'vin',
        },
        {
            title: 'Make',
            key: 'truckMake.name',
        },
        {
            title: 'Model',
            key: 'truckType.name',
        },
        {
            title: 'Mileage',
            key: 'mileage',
        },
    ];

    static displayRowsBackShop: CardRows[] = [
        {
            title: 'Owner - Name',
            key: 'owner.name',
        },
        {
            title: 'Owner • Commission',
            key: 'commission',
            secondKey: 'loadDelivery.location',
            thirdKey: 'loadDelivery.date',
        },
        {
            title: 'Licence • Expiration',
            key: 'inspectionExpirationDays',
        },
        {
            title: 'FHWA • Expiration',
            key: 'fhwaExp',
        },
    ];
}
