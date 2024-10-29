import { CardRows } from '@shared/models/card-models/card-rows.model';

export class TruckCardsModalConfig {
    static rows: number = 4;

    static page: string = 'truck';

    static displayRowsFrontActive: CardRows[] = [
        {
            title: 'VIN',
            key: 'tableVin',
            secondKey: 'regularText',
            thirdKey: 'boldText',
        },
        {
            title: 'Make',
            key: 'textMake',
        },
        {
            title: 'Model',
            key: 'textModel',
        },
        {
            title: 'Mileage',
            key: 'tableMileage',
        },
        null,
        null,
    ];

    static displayRowsBackActive: CardRows[] = [
        {
            title: 'Owner • Name',
            key: 'tabelOwnerDetailsName',
        },
        {
            title: 'Owner • Commission',
            secondTitle: 'Commission',
            key: 'tabelOwnerDetailsComm',
        },
        {
            title: 'Licence Detail • Expiration',
            secondTitle: 'Expiration',
            key: 'tableLicencePlateDetailExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        {
            title: 'FHWA Inspection • Expiration',
            secondTitle: 'Expiration',
            key: 'tableFHWAInspectionExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
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
            title: 'Owner • Name',
            key: 'tabelOwnerDetailsName',
        },
        {
            title: 'Owner • Commission',
            secondTitle: 'Commission',
            key: 'tabelOwnerDetailsComm',
        },
        {
            title: 'Licence Detail • Expiration',
            secondTitle: 'Expiration',
            key: 'tableLicencePlateDetailExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        {
            title: 'FHWA Inspection • Expiration',
            secondTitle: 'Expiration',
            key: 'tableFHWAInspectionExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        null,
        null,
    ];
}
