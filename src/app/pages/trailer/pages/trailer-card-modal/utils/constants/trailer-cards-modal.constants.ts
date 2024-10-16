import { CardRows } from '@shared/models/card-models/card-rows.model';

export class TrailerCardsModalData {
    static frontDataLoad: CardRows[] = [
        {
            title: 'VIN',
            key: 'tableVin',
            secondKey: 'regularText',
            thirdKey: 'boldText',
            selected: true,
        },
        {
            title: 'Make',
            key: 'tableMake',
            selected: true,
        },
        {
            title: 'Model',
            key: 'tableModel',
            selected: true,
        },
        {
            title: 'Length',
            key: 'tabelLength',
            selected: true,
        },
    ];
    static BackDataLoad: CardRows[] = [
        {
            title: 'Year',
            key: 'year',
            selected: true,
        },
        {
            title: 'Color',
            key: 'color',
            secondKey: 'code',
            thirdKey: 'name',
            selected: true,
        },
        {
            title: 'Licence Detail • Expiration',
            secondTitle: 'Expiration',
            key: 'tableLicencePlateDetailExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
            selected: true,
        },
        {
            title: 'FHWA Inspection • Expiration',
            secondTitle: 'Expiration',
            key: 'tableFHWAInspectionExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
            selected: true,
        },
    ];
    static allDataLoad: CardRows[] = [
        {
            title: 'Type',
        },
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
            title: 'Length',
            key: 'tabelLength',
        },
        {
            title: 'Owner',
            key: 'tableOwner',
        },
        {
            isDropdown: true,
            title: 'Weight',
            values: [
                {
                    id: 4,
                    title: 'Weight • Empty',
                    secondTitle: 'Empty',
                    key: 'tableWeightEmpty',
                },
                {
                    id: 12,
                    title: 'Weight • Volume',
                    secondTitle: 'Volume',
                    key: 'tableWeightVolume',
                },
            ],
        },
        {
            title: 'Axle',
            key: 'tableAxle',
        },
        {
            title: 'Suspension',
            key: 'tableSuspension',
        },
        {
            title: 'Tire Size',
            key: 'tableTireSize',
        },
        {
            title: 'Reefer Unit',
            key: 'tableReeferUnit',
        },
        {
            title: 'Door Type',
            key: 'tableDoorType',
        },
        {
            title: 'Ins. Policy',
            key: 'tableInsPolicy',
        },
        {
            title: 'Mileage',
            key: 'tableMileage',
        },
        {
            isDropdown: true,
            title: 'Purchase Detail',
            values: [
                {
                    id: 4,
                    title: 'Purchase Detail • Date',
                    secondTitle: 'Date',
                    key: 'tablePurchaseDate',
                },
                {
                    id: 12,
                    title: 'Purchase Detail • Price',
                    secondTitle: 'Price',
                    key: 'tablePurchasePrice',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Licence Detail',
            values: [
                {
                    id: 4,
                    title: 'Licence Detail • Plate Number',
                    secondTitle: 'Plate Number',
                    key: 'tableLicencePlateDetailNumber',
                },
                {
                    id: 12,
                    title: 'Licence Detail • State Issued',
                    secondTitle: 'State Issued',
                    key: 'tableLicencePlateDetailST',
                    secondKey: 'tableLicencePlateDetailState',
                },
                {
                    id: 12,
                    title: 'Licence Detail • Expiration',
                    secondTitle: 'Expiration',
                    key: 'tableLicencePlateDetailExpiration',
                    secondKey: 'expirationDaysText',
                    thirdKey: 'percentage',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'FHWA Inspection',
            values: [
                {
                    id: 10,
                    title: 'FHWA Inspection • Issue Date',
                    secondTitle: 'Issue Date',
                    key: 'tableFHWAInspectionIssues',
                },
                {
                    id: 11,
                    title: 'FHWA Inspection • Term',
                    secondTitle: 'Term',
                    key: 'tableFHWAInspectionTerm',
                },
                {
                    id: 11,
                    title: 'FHWA Inspection • Expiration',
                    secondTitle: 'Expiration',
                    key: 'tableFHWAInspectionExpiration',
                    secondKey: 'expirationDaysText',
                    thirdKey: 'percentage',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Title',
            values: [
                {
                    id: 10,
                    title: 'Title • Number',
                    secondTitle: 'Number',
                    key: 'tableTitleNumber',
                },
                {
                    id: 11,
                    title: 'Title • State Issued',
                    secondTitle: 'State Issued',
                    key: 'tableTitleST',
                    secondKey: 'tableTitleState',
                },
                {
                    id: 11,
                    title: 'Title • Purchase Date',
                    secondTitle: 'Purchase Date',
                    key: 'tablePurchaseDate',
                },
                {
                    id: 11,
                    title: 'Title • Issue Date',
                    secondTitle: 'Issue Date',
                    key: 'tableTitleIssued',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Assigned to',
            values: [
                {
                    id: 10,
                    title: 'Assigned • Driver',
                    secondTitle: 'Driver',
                    key: 'tableDriver',
                    secondKey: 'tableDriverAvatar',
                },
                {
                    id: 11,
                    title: 'Assigned • Truck',
                    secondTitle: 'Truck',
                    key: 'tableTruck',
                },
            ],
        },
        {
            title: 'Date Deactivated',
            key: 'tableDeactivated',
        },
        {
            id: 14,
            title: 'Date Added',
            key: 'tableAdded',
        },
        {
            id: 15,
            title: 'Date Edited',
            key: 'tableEdited',
        },
    ];
}
