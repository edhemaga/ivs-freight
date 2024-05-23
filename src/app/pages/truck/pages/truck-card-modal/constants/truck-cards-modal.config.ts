import { CardRows } from '@shared/models/card-models/card-rows.model';

export class TruckCardsModalConfig {
    static rows: number = 4;

    static page: string = 'Truck';

    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'Vin',
            key: 'vin',
        },
        {
            title: 'Make',
            key: 'truckMake',
            secondKey: 'name',
        },
        {
            title: 'Model',
            key: 'model',
        },
        {
            title: 'Mileage',
            key: 'mileage',
        },
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Owner - Name',
            key: 'owner',
            secondKey: 'name',
        },
        {
            title: 'Owner • Commission',
            key: 'commission',
        },
        {
            title: 'Licence • Expiration',
            key: 'inspectionExpirationDays',
        },
        {
            title: 'FHWA • Expiration',
            key: 'fhwaExp',
        },
        null,
        null,
    ];

    static displayRowsFrontInactive: CardRows[] = [
        {
            title: 'Vin',
            key: 'vin',
        },
        {
            title: 'Make',
            key: 'truckMake',
            secondKey: 'name',
        },
        {
            title: 'Model',
            key: 'truckType',
            secondKey: 'name',
        },
        {
            title: 'Mileage',
            key: 'mileage',
        },
        null,
        null,
    ];

    static displayRowsBackInactive: CardRows[] = [
        {
            title: 'Owner - Name',
            key: 'owner',
            secondKey: 'name',
        },
        {
            title: 'Owner • Commission',
            key: 'commission',
        },
        {
            title: 'Licence • Expiration',
            key: 'inspectionExpirationDays',
        },
        {
            title: 'FHWA • Expiration',
            key: 'fhwaExp',
        },
        null,
        null,
    ];
}
