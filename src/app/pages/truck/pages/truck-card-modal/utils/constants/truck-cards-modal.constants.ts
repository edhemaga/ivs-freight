import { CardRows } from '@shared/models/card-models/card-rows.model';

export class TruckCardsModalData {
    static frontDataLoad: CardRows[] = [
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
    ];

    static backDataLoad: CardRows[] = [
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
    ];

    static allDataLoad: CardRows[] = [
        {
            title: 'Type',
            secondKey: 'name',
            key: 'truckType',
        },
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
            id: 4,
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
            isDropdown: true,
            title: 'Owner Detail',
            values: [
                {
                    title: 'Owner • Name',
                    secondTitle: 'Bussiness Name',
                    key: 'tabelOwnerDetailsName',
                },
                {
                    title: 'Owner • Commission',
                    secondTitle: 'Commission',
                    key: 'tabelOwnerDetailsComm',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Weight',
            values: [
                {
                    title: 'Weight • Gross',
                    secondTitle: 'Gross',
                    key: 'textWeightGross',
                },
                {
                    title: 'Weight • Empty',
                    secondTitle: 'Empty',
                    key: 'textWeightEmpty',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Engine Detail',
            values: [
                {
                    title: 'Engine • Model',
                    secondTitle: 'Model',
                    key: 'tabelEngineModel',
                },
                {
                    title: 'Engine • Oil',
                    secondTitle: 'Oil Type',
                    key: 'tabelEngineOilType',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Fuel Detail',
            values: [
                {
                    title: 'Fuel • Type',
                    secondTitle: 'Fuel Type',
                    key: 'tabelFuelDetailsFuelType',
                },
                {
                    title: 'Fuel • Tank Size',
                    secondTitle: 'Tank Size',
                    key: 'tabelFuelDetailsTank',
                },
            ],
        },
        {
            title: 'AP Unit',
            key: 'tableAPUnit',
        },
        {
            isDropdown: true,
            title: 'Transmission',
            values: [
                {
                    title: 'Transmission • Model',
                    secondTitle: 'Model',
                    key: 'tabelTransmissionModel',
                },
                {
                    title: 'Transmission • Shifter',
                    secondTitle: 'Shifter',
                    key: 'tabelTransmissionRatio',
                },
                {
                    title: 'Transmission • Gear Ratio',
                    secondTitle: 'Gear Ratio',
                    key: 'tabelTransmissionShifter',
                },
            ],
        },

        {
            title: 'Tire Size',
            key: 'tableTireSize',
        },
        {
            title: 'Axle',
            key: 'tabelAxle',
        },
        {
            title: 'Brakes',
            key: 'tabelBrakes',
        },
        {
            isDropdown: true,
            title: 'Wheel Detail',
            values: [
                {
                    title: 'Wheel • Base',
                    secondTitle: 'Wheel Base',
                    key: 'wheelBase',
                },
                {
                    title: 'Front • Wheels',
                    secondTitle: 'Front Wheels',
                    key: 'tableWheelCompositionFront',
                },
                {
                    title: 'Rear • Wheels',
                    secondTitle: 'Rear Wheels',
                    key: 'tableWheelCompositionRear',
                },
            ],
        },

        {
            title: 'Features',
            key: 'tableFeatures',
        },
        {
            isDropdown: true,
            title: 'Toll Device',
            values: [
                {
                    title: 'Toll • Transponder',
                    secondTitle: 'Toll Transponder',
                    key: 'tableTollDeviceTransponder',
                },
                {
                    title: 'Toll • Device Number',
                    secondTitle: 'Device Number',
                    key: 'tableTollDeviceNo',
                },
            ],
        },
        {
            title: 'Insurance Policy',
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
                    title: 'Purchase • Date',
                    secondTitle: 'Date',
                    key: 'tablePurchaseDate',
                },
                {
                    title: 'Purchase • Price',
                    secondTitle: 'Price',
                    key: 'tablePurchasePrice',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'FHWA Inspection',
            values: [
                {
                    title: 'FHWA Inspection • Issue Date',
                    secondTitle: 'Issue Date',
                    key: 'tableFHWAInspectionIssues',
                },
                {
                    title: 'FHWA Inspection • Term',
                    secondTitle: 'Term',
                    key: 'tableFHWAInspectionTerm',
                },
                {
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
            title: 'Licence Detail',
            values: [
                {
                    title: 'Licence Detail • Plate Number',
                    secondTitle: 'Plate Number',
                    key: 'tableLicencePlateDetailNumber',
                },
                {
                    title: 'Licence Detail • State Issued',
                    secondTitle: 'State Issued',
                    key: 'tableLicencePlateDetailST',
                    secondKey: 'tableLicencePlateDetailState',
                },
                {
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
            title: 'Title',
            values: [
                {
                    title: 'Title • Number',
                    secondTitle: 'Number',
                    key: 'tableTitleNumber',
                },
                {
                    title: 'Title • State Issued',
                    secondTitle: 'State Issued',
                    key: 'tableTitleST',
                },
                {
                    title: 'Title • Purchase Date',
                    secondTitle: 'Purchase Date',
                    key: 'tableTitlePurchase',
                },
                {
                    title: 'Title • Issue Date',
                    secondTitle: 'Issue Date',
                    key: 'tableTitleIssued',
                },
            ],
        },

        {
            isDropdown: true,
            title: 'Assigned To',
            values: [
                {
                    title: 'Assigned • Driver',
                    secondTitle: 'Driver',
                    key: 'tableDriver',
                    secondKey: 'tableDriverAvatar',
                },
                {
                    title: 'Assigned • Trailer',
                    secondTitle: 'Trailer',
                    key: 'tableTrailer',
                },
            ],
        },

        {
            title: 'Date Added',
            key: 'tableAdded',
        },
        {
            title: 'Date Edited',
            key: 'tableEdited',
        },
        {
            title: 'Date Deactivated',
            key: 'tableDeactivated',
        },
    ];
}
