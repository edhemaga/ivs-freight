import { CardRows } from '@shared/models/card-models/card-rows.model';

export class PMCardsModalData {
    static FrontDataPM: CardRows[] = [
        {
            title: 'Engine Oil & Filter',
            field: 'oilFilter',
            key: 'oilFilter.expirationMiles',
            secondKey: 'oilFilter.percentage',
            selected: true,
        },
        {
            title: 'Air Filter',
            field: 'airFilter',
            key: 'airFilter.expirationMiles',
            secondKey: 'airFilter.percentage',
            selected: true,
        },
        {
            title: 'Transmission Fluid',
            field: 'transFluid',
            key: 'transFluid.expirationMiles',
            secondKey: 'transFluid.percentage',
            selected: true,
        },
        {
            title: 'Belts',
            field: 'belts',
            key: 'belts.expirationMiles',
            secondKey: 'belts.percentage',
            selected: true,
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
            title: 'Repair Shop - Name',
            key: 'textRepairShop',
            selected: true,
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
            id: 6,
            title: 'Repair Shop - Name',
            key: 'textRepairShop',
        },
        {
            id: 7,
            title: 'Repair Shop - Address',
            key: 'textRepairShopAddress',
        },
        {
            id: 8,
            title: 'Engine Oil & Filter',
            field: 'oilFilter',
            key: 'oilFilter.expirationMiles',
            secondKey: 'oilFilter.percentage',
        },
        {
            id: 9,
            title: 'Air Filter',
            field: 'airFilter',
            key: 'airFilter.expirationMiles',
            secondKey: 'airFilter.percentage',
        },
        {
            id: 10,
            title: 'Belts',
            field: 'belts',
            key: 'belts.expirationMiles',
            secondKey: 'belts.percentage',
        },
        {
            id: 11,
            title: 'Transmission Fluid',
            field: 'transFluid',
            key: 'transFluid.expirationMiles',
            secondKey: 'transFluid.percentage',
        },
        {
            id: 12,
            title: 'Engine Tune-Up',
            field: 'engTuneUp',
            key: 'engTuneUp.expirationMiles',
            secondKey: 'engTuneUp.percentage',
        },
        {
            id: 13,
            title: 'Alignment',
            field: 'alignment',
            key: 'alignment.expirationMiles',
            secondKey: 'alignment.percentage',
        },
        {
            id: 14,
            title: 'Battery',
            field: 'battery',
            key: 'battery.expirationMiles',
            secondKey: 'battery.percentage',
        },
        {
            id: 15,
            title: 'Brake Chamber',
            field: 'brakeChamber',
            key: 'brakeChamber.expirationMiles',
            secondKey: 'brakeChamber.percentage',
        },
        {
            id: 16,
            title: 'Oil Pump',
            field: 'oilPump',
            key: 'oilPump.expirationMiles',
            secondKey: 'oilPump.percentage',
        },
        {
            id: 17,
            title: 'Water Pump',
            field: 'waterPump',
            key: 'waterPump.expirationMiles',
            secondKey: 'waterPump.percentage',
        },
        {
            id: 18,
            title: 'Fuel Pump',
            field: 'fuelPump',
            key: 'fuelPump.expirationMiles',
            secondKey: 'fuelPump.percentage',
        },
        {
            id: 19,
            title: 'Air Compressor',
            field: 'airCompressor',
            key: 'airCompressor.expirationMiles',
            secondKey: 'airCompressor.percentage',
        },
        {
            id: 20,
            title: 'AC Compressor',
            field: 'acCompressor',
            key: 'acCompressor.expirationMiles',
            secondKey: 'acCompressor.percentage',
        },
        {
            id: 21,
            title: 'Turbo',
            field: 'turbo',
            key: 'turbo.expirationMiles',
            secondKey: 'turbo.percentage',
        },
        {
            id: 22,
            title: 'Radiator',
            field: 'radiator',
            key: 'radiator.expirationMiles',
            secondKey: 'radiator.percentage',
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
            id: 6,
            title: 'Repair Shop - Name',
            key: 'textRepairShop',
        },
        {
            id: 7,
            title: 'Repair Shop - Address',
            key: 'textRepairShopAddress',
        },
        {
            id: 8,
            title: 'General',
            field: 'general',
            key: 'general.expirationDaysText',
            secondKey: 'general.percentage',
        },
        {
            id: 9,
            title: 'Reefer Unit',
            field: 'reeferUnit',
            key: 'reeferUnit.expirationDaysText',
            secondKey: 'reeferUnit.percentage',
        },
        {
            id: 10,
            title: 'Alignment',
            field: 'alignment',
            key: 'alignment.expirationDaysText',
            secondKey: 'alignment.percentage',
        },
        {
            id: 11,
            title: 'PTO Pump',
            field: 'ptoPump',
            key: 'ptoPump.expirationDaysText',
            secondKey: 'ptoPump.percentage',
        },
    ];
}
