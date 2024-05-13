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
            key: 'tabelOwnerDetailsName.owner',
            secondKey: 'tabelOwnerDetailsName.comm',
            thirdKey: 'tabelOwnerDetailsName.Weight',
            selected: true,
        },
        {
            title: 'Delivery',
            key: 'loadDelivery.count',
            secondKey: 'loadDelivery.location',
            thirdKey: 'loadDelivery.date',
            selected: true,
        },
        {
            title: 'Total Miles',
            key: 'totalMiles',
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
            key: 'truckMake.name',
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
            key: 'color.name',
        },
        {
            id: 6,
            title: 'Owner',
            key: 'owner.name',
        },

        { id: 7, title: 'Owner - Commission', key: 'commission' },
        { id: 8, title: 'Weight - gross', key: 'truckGrossWeight.name' },
        { id: 9, title: 'Engine - Oil', key: 'engineOilType.name' },

        { id: 10, title: 'Engine - Model', key: 'truckEngineModel.name' },
        { id: 11, title: 'Fuel Type', key: 'fuelType.name' },
        { id: 12, title: 'Fuel Tank Size', key: 'fuelTankSize' },

        { id: 13, title: 'AP Unit', key: 'apUnit.name' },
        { id: 14, title: 'Transmission Model', key: 'transmissionModel' },
        { id: 15, title: 'Shifter', key: 'shifter' },
        {
            id: 16,
            title: 'Transmission - Gear Ratio',
            key: 'gearRatio.name',
        },
        { id: 17, title: 'Tire Size', key: 'tireSize.name' },
        { id: 18, title: 'Axle', key: 'axles' },
        { id: 19, title: 'Brakes', key: 'brakes.name' },
        { id: 20, title: 'Wheel Base', key: 'wheelBase' },

        { id: 21, title: 'Front Wheels', key: 'tireSize.name' },
        { id: 22, title: 'Rear Wheels', key: 'rearWheels.name' },
        { id: 23, title: 'Features', key: 'brakes.name' },

        { id: 24, title: 'Toll Transponder', key: 'tollTransponder.name' },
        { id: 25, title: 'Device Number', key: 'tollTransponderDeviceNo' },
        { id: 26, title: 'Insurance Policy', key: 'insurancePolicy' },
        { id: 27, title: 'Mileage', key: 'mileage' },
        { id: 28, title: 'Purchase Date', key: 'purchaseDate' },

        { id: 29, title: 'Purchase Price', key: 'purchasePrice' },
        { id: 30, title: 'Licence - Plate Number', key: 'licensePlate' },
        { id: 31, title: 'Licence -State Issued', key: 'NA' },
        {
            id: 32,
            title: 'Licence -Expiration',
            key: 'registrationExpirationDays',
        },
        { id: 33, title: 'FHWA - Issue Date', key: 'wheelBase' },

        { id: 34, title: 'FHWA - Term', key: 'fhwaExp' },
        {
            id: 35,
            title: 'FHWA - Expiration',
            key: 'inspectionExpirationDays',
        },
        { id: 36, title: 'Title - Number', key: 'titles[0]?.number' },
        {
            id: 37,
            title: 'Title - State Issued',
            key: 'titles[0]?.state?.state',
        },
        {
            id: 38,
            title: 'Title - Purchase Date',
            key: 'titles[0]?.purchaseDate',
        },
        { id: 39, title: 'Title - Issue Date', key: 'titles[0]?.issueDate' },

        {
            id: 40,
            title: 'Assigned To - Driver',
            key: 'assignedTo.driver.name',
        },
        {
            id: 41,
            title: 'Assigned To - Trailer',
            key: 'assignedTo.trailer.trailerNumber',
        },
        { id: 42, title: 'Date Added', key: 'createdAt' },
        { id: 43, title: 'Date Edited', key: 'updatedAt' },
    ];
}
