import { CardRows } from '@shared/models/card-models/card-rows.model';

export class PMCardsModalData {
    static FrontDataPM: CardRows[] = [
        {
            title: 'Engine Oil & Filter',
            field: 'oilFilter',
            key: 'oilFilter.expirationMiles',
            secondKey: 'oilFilter.percentage',
            type: 'progress',
        },
        {
            title: 'Air Filter',
            field: 'airFilter',
            key: 'airFilter.expirationMiles',
            secondKey: 'airFilter.percentage',
            type: 'progress',
        },
        {
            title: 'Transmission Fluid',
            field: 'transFluid',
            key: 'transFluid.expirationMiles',
            secondKey: 'transFluid.percentage',
            type: 'progress',
        },
        {
            title: 'Belts',
            field: 'belts',
            key: 'belts.expirationMiles',
            secondKey: 'belts.percentage',
            type: 'progress',
        },
    ];

    static BackDataPM: CardRows[] = [
        {
            title: 'Make',
            key: 'textMake',
            selected: true,
        },
        {
            title: 'Odometer',
            key: 'textOdometer',
            selected: true,
        },
        {
            title: 'Last Service',
            key: 'lastService',
            selected: true,
        },
        {
            title: 'Shop Detail • Address',
            secondTitle: 'Address',
            key: 'textRepairShopAddress',
        },
    ];

    static allDataPMTruck: CardRows[] = [
        {
            id: 1,
            title: 'Make',
            key: 'textMake',
        },
        {
            id: 2,
            title: 'Model',
            key: 'textModel',
        },
        {
            id: 3,
            title: 'Year',
            key: 'textYear',
        },
        {
            id: 4,
            title: 'Odometer',
            key: 'textOdometer',
        },
        {
            id: 5,
            title: 'Last Serviced Date',
            key: 'lastService',
        },
        {
            isDropdown: true,
            title: 'Shop Detail',
            values: [
                {
                    title: 'Shop Detail • Name',
                    secondTitle: 'Name',
                    key: 'textRepairShop',
                },
                {
                    title: 'Shop Detail • Address',
                    secondTitle: 'Address',
                    key: 'textRepairShopAddress',
                },
            ],
        },
        {
            id: 8,
            title: 'Engine Oil & Filter',
            field: 'oilFilter',
            key: 'oilFilter.expirationMiles',
            secondKey: 'oilFilter.percentage',
            type: 'progress',
        },
        {
            id: 9,
            title: 'Air Filter',
            field: 'airFilter',
            key: 'airFilter.expirationMiles',
            secondKey: 'airFilter.percentage',
            type: 'progress',
        },
        {
            id: 10,
            title: 'Belts',
            field: 'belts',
            key: 'belts.expirationMiles',
            secondKey: 'belts.percentage',
            type: 'progress',
        },
        {
            id: 11,
            title: 'Transmission Fluid',
            field: 'transFluid',
            key: 'transFluid.expirationMiles',
            secondKey: 'transFluid.percentage',
            type: 'progress',
        },
        {
            id: 12,
            title: 'Engine Tune-Up',
            field: 'engTuneUp',
            key: 'engTuneUp.expirationMiles',
            secondKey: 'engTuneUp.percentage',
            type: 'progress',
        },
        {
            id: 13,
            title: 'Alignment',
            field: 'alignment',
            key: 'alignment.expirationMiles',
            secondKey: 'alignment.percentage',
            type: 'progress',
        },
        {
            id: 14,
            title: 'Battery',
            field: 'battery',
            key: 'battery.expirationMiles',
            secondKey: 'battery.percentage',
            type: 'progress',
        },
        {
            id: 15,
            title: 'Brake Chamber',
            field: 'brakeChamber',
            key: 'brakeChamber.expirationMiles',
            secondKey: 'brakeChamber.percentage',
            type: 'progress',
        },
        {
            id: 16,
            title: 'Oil Pump',
            field: 'oilPump',
            key: 'oilPump.expirationMiles',
            secondKey: 'oilPump.percentage',
            type: 'progress',
        },
        {
            id: 17,
            title: 'Water Pump',
            field: 'waterPump',
            key: 'waterPump.expirationMiles',
            secondKey: 'waterPump.percentage',
            type: 'progress',
        },
        {
            id: 18,
            title: 'Fuel Pump',
            field: 'fuelPump',
            key: 'fuelPump.expirationMiles',
            secondKey: 'fuelPump.percentage',
            type: 'progress',
        },
        {
            id: 19,
            title: 'Air Compressor',
            field: 'airCompressor',
            key: 'airCompressor.expirationMiles',
            secondKey: 'airCompressor.percentage',
            type: 'progress',
        },
        {
            id: 20,
            title: 'AC Compressor',
            field: 'acCompressor',
            key: 'acCompressor.expirationMiles',
            secondKey: 'acCompressor.percentage',
            type: 'progress',
        },
        {
            id: 21,
            title: 'Turbo',
            field: 'turbo',
            key: 'turbo.expirationMiles',
            secondKey: 'turbo.percentage',
            type: 'progress',
        },
        {
            id: 22,
            title: 'Radiator',
            field: 'radiator',
            key: 'radiator.expirationMiles',
            secondKey: 'radiator.percentage',
            type: 'progress',
        },
    ];

    static allDataPMTrailer: CardRows[] = [
        {
            id: 1,
            title: 'Make',
            key: 'textMake',
        },
        {
            id: 2,
            title: 'Model',
            key: 'textModel',
        },
        {
            id: 3,
            title: 'Year',
            key: 'textYear',
        },
        {
            id: 4,
            title: 'Odometer',
            key: 'textOdometer',
        },
        {
            id: 5,
            title: 'Last Service',
            key: 'lastService',
        },
        {
            isDropdown: true,
            title: 'Shop Detail',
            values: [
                {
                    title: 'Shop Detail • Name',
                    secondTitle: 'Name',
                    key: 'textRepairShop',
                },
                {
                    title: 'Shop Detail • Address',
                    secondTitle: 'Address',
                    key: 'textRepairShopAddress',
                },
            ],
        },
        {
            id: 8,
            title: 'General',
            field: 'general',
            key: 'general.expirationDaysText',
            secondKey: 'general.percentage',
            type: 'progress',
        },
        {
            id: 9,
            title: 'Reefer Unit',
            field: 'reeferUnit',
            key: 'reeferUnit.expirationDaysText',
            secondKey: 'reeferUnit.percentage',
            type: 'progress',
        },
        {
            id: 10,
            title: 'Alignment',
            field: 'alignment',
            key: 'alignment.expirationDaysText',
            secondKey: 'alignment.percentage',
            type: 'progress',
        },
        {
            id: 11,
            title: 'PTO Pump',
            field: 'ptoPump',
            key: 'ptoPump.expirationDaysText',
            secondKey: 'ptoPump.percentage',
            type: 'progress',
        },
    ];
}
