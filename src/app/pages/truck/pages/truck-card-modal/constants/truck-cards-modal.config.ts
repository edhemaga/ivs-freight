import { CardRows } from 'src/app/shared/models/card-models/card-rows.model';

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
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
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
        null,
        null,
    ];

    static displayRowsBackInactive: CardRows[] = [
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
        null,
        null,
    ];
}
