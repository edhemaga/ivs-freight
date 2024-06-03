import { CardRows } from '@shared/models/card-models/card-rows.model';

export class TruckCardsModalData {
    static frontDataLoad: CardRows[] = [
        {
            title: 'Vin',
            key: 'vin',
            selected: true,
        },
        {
            title: 'Make',
            key: 'truckMake.name',
            selected: true,
        },
        {
            title: 'Model',
            key: 'model',
            selected: true,
        },
        {
            title: 'Mileage',
            key: 'mileage',
            selected: true,
        },
    ];
    static BackDataLoad: CardRows[] = [
        {
            title: 'Owner - name',
            key: 'tabelOwnerDetailsName',
            secondKey: 'owner',
            selected: true,
        },
        {
            title: 'Engine - Oil',
            secondKey: 'name',
            key: 'engineOilType',
            selected: true,
        },
        {
            title: 'Color',
            secondKey: 'name',
            key: 'color',
            selected: true,
        },
        {
            title: 'Rate',
            key: 'textBase',
            selected: true,
        },
    ];
    static allDataLoad: CardRows[] = [
        {
            id: 1,
            title: 'Vin',
            key: 'vin',
        },
        {
            id: 2,
            title: 'Make',
            secondKey: 'name',
            key: 'truckMake',
        },
        {
            id: 3,
            title: 'Model',
            key: 'model',
        },
        {
            id: 4,
            title: 'Year',
            key: 'year',
        },

        {
            id: 5,
            title: 'Color',
            secondKey: 'name',
            key: 'color',
        },
        {
            id: 6,
            title: 'Type',
            secondKey: 'name',
            key: 'truckType',
        },
        {
            isDropdown: true,
            title: 'Owner',
            values: [
                {
                    id: 44,
                    title: 'Business Name',
                    secondTitle: ' Business Name',
                    secondKey: 'name',
                    key: 'name',
                },
                {
                    id: 7,
                    title: 'Owner - Commission',
                    secondTitle: ' Commission',
                    key: 'commission',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Weight Detail',
            values: [
                {
                    id: 9,
                    title: 'Weight - gross',
                    secondTitle: ' gross',
                    secondKey: 'name',
                    key: 'truckGrossWeight',
                },

                {
                    id: 10,
                    title: 'Engine - Model',
                    secondTitle: ' Model',
                    secondKey: 'name',
                    key: 'truckEngineModel',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Engine Detail',
            values: [
                {
                    id: 9,
                    title: 'Engine - Oil',
                    secondTitle: ' Oil',
                    secondKey: 'name',
                    key: 'engineOilType',
                },

                {
                    id: 10,
                    title: 'Engine - Model',
                    secondTitle: ' Model',
                    secondKey: 'name',

                    key: 'truckEngineModel',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Fuel Detail',
            values: [
                {
                    id: 11,
                    title: 'Fuel Type',
                    secondTitle: ' Fuel Type',
                    secondKey: 'name',
                    key: 'fuelType',
                },
                {
                    id: 12,
                    title: 'Fuel Tank Size',
                    secondTitle: ' Tank Size',
                    key: 'fuelTankSize',
                },
            ],
        },
        { id: 13, title: 'AP Unit', key: 'apUnit', secondKey: 'name' },
        {
            isDropdown: true,
            title: 'Transmission',
            values: [
                {
                    id: 14,
                    title: 'Transmission Model',
                    secondTitle: ' Model',

                    key: 'transmissionModel',
                },
                {
                    id: 15,
                    title: 'Shifter',
                    secondTitle: ' Shifter',
                    secondKey: 'name',
                    key: 'shifter',
                },
                {
                    id: 16,
                    title: 'Transmission - Gear Ratio',
                    secondTitle: ' Gear Ratio',
                    secondKey: 'name',

                    key: 'gearRatio',
                },
            ],
        },

        { id: 17, title: 'Tire Size', key: 'tireSize', secondKey: 'name' },
        { id: 18, title: 'Axle', key: 'axles' },
        { id: 19, title: 'Brakes', key: 'brakes', secondKey: 'name' },
        {
            isDropdown: true,
            title: 'Wheel Detail',
            values: [
                {
                    id: 20,
                    title: 'Wheel Base',
                    secondTitle: ' Wheel Base',
                    key: 'wheelBase',
                },

                {
                    id: 21,
                    title: 'Front Wheels',
                    secondTitle: ' Front Wheels',
                    secondKey: 'name',
                    key: 'tireSize',
                },
                {
                    id: 22,
                    title: 'Rear Wheels',
                    secondTitle: ' Rear Wheels',
                    secondKey: 'name',
                    key: 'rearWheels',
                },
            ],
        },

        { id: 23, title: 'Features', key: 'brakes', secondKey: 'name' },
        {
            isDropdown: true,
            title: 'Toll Device',
            values: [
                {
                    id: 28,
                    title: 'Toll Transponder',
                    secondTitle: ' Toll Transponder',
                    secondKey: 'name',
                    key: 'tollTransponder',
                },

                {
                    id: 29,
                    title: 'Device Number',
                    secondTitle: ' Device Number',
                    key: 'tollTransponderDeviceNo',
                },
            ],
        },
        { id: 26, title: 'Insurance Policy', key: 'insurancePolicy' },
        { id: 27, title: 'Mileage', key: 'mileage' },
        {
            isDropdown: true,
            title: 'Purchase',
            values: [
                {
                    id: 28,
                    title: 'Purchase Date',
                    secondTitle: ' Date',
                    key: 'purchaseDate',
                },

                {
                    id: 29,
                    title: 'Purchase Price',
                    secondTitle: ' Price',
                    key: 'purchasePrice',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'FHWA',
            values: [
                {
                    id: 33,
                    title: 'FHWA - Issue Date',
                    secondTitle: ' Issue Date',
                    key: 'wheelBase',
                },

                {
                    id: 34,
                    title: 'FHWA - Term',
                    secondTitle: ' Term',
                    key: 'fhwaExp',
                },
                {
                    id: 35,
                    title: 'FHWA - Expiration',
                    secondTitle: ' Expiration',

                    key: 'inspectionExpirationDays',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Licence',
            values: [
                {
                    id: 30,
                    title: 'Licence - Plate Number',
                    secondTitle: ' Plate Number',

                    key: 'licensePlate',
                },
                {
                    id: 31,
                    title: 'Licence -State Issued',
                    secondTitle: ' State Issued',
                    key: 'NA',
                },
                {
                    id: 32,
                    title: 'Licence -Expiration',
                    secondTitle: ' Expiration',

                    key: 'registrationExpirationDays',
                },
            ],
        },
        {
            isDropdown: true,
            title: 'Title',
            values: [
                {
                    id: 36,
                    title: 'Title - Number',
                    secondTitle: ' Number',
                    key: 'titleNumber',
                },
                {
                    id: 37,
                    title: 'Title - State Issued',
                    secondTitle: ' State Issued',

                    key: 'titleState',
                },
                {
                    id: 38,
                    title: 'Title - Purchase Date',
                    secondTitle: ' Purchase Date',

                    key: 'titlePurchaseDate',
                },
                {
                    id: 39,
                    title: 'Title - Issue Date',
                    secondTitle: ' Issue Date',

                    key: 'titleIssueDate',
                },
            ],
        },

        {
            isDropdown: true,
            title: 'Assigned To',
            values: [
                {
                    id: 40,
                    title: 'Assigned To - Driver',
                    secondTitle: ' Driver',
                    secondKey: 'driver',
                    thirdKey: 'name',

                    key: 'assignedTo',
                },
                {
                    id: 41,
                    title: 'Assigned To - Trailer',
                    secondTitle: ' Trailer',
                    secondKey: 'trailer',
                    thirdKey: 'trailerNumber',

                    key: 'assignedTo',
                },
            ],
        },

        { id: 42, title: 'Date Added', key: 'createdAt' },
        { id: 43, title: 'Date Edited', key: 'updatedAt' },
    ];
}
