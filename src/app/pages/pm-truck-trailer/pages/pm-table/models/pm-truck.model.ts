import { TruckMinimalResponse, TruckTypeResponse } from 'appcoretruckassist';
import {
    DropdownItem,
    PmTruckProgressData,
} from 'src/app/shared/models/card-models/card-table-data.model';

export interface PmTruck {
    textUnit: string;
    textOdometer: string;
    acCompressor?: PmTruckProgressData;
    airCompressor?: PmTruckProgressData;
    airFilter?: PmTruckProgressData;
    alignment?: PmTruckProgressData;
    battery?: PmTruckProgressData;
    belts?: PmTruckProgressData;
    brakeChamber?: PmTruckProgressData;
    engTuneUp?: PmTruckProgressData;
    fuelPump?: PmTruckProgressData;
    oilFilter?: PmTruckProgressData;
    oilPump?: PmTruckProgressData;
    radiator?: PmTruckProgressData;
    transFluid?: PmTruckProgressData;
    turbo?: PmTruckProgressData;
    waterPump?: PmTruckProgressData;
    textInv: string;
    textLastShop: string;
    lastService: string;
    repairShop: string;
    ruMake: string;
    truckTypeClass: string;
    truckTypeIcon: string;
    tableTruckName: string;
    truckType: TruckTypeResponse;
    tableTruckColor: string;
    additionalData: any;
    tableDropdownContent: {
        hasContent: boolean;
        content: DropdownItem[];
    };
    truck: TruckMinimalResponse;
    pmId: number;
}
