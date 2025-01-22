import {
    RepairShopPMResponse,
    TruckShortResponse,
    TruckTypeResponse,
} from 'appcoretruckassist';
import { PmTruckProgressData } from '@shared/models/card-models/card-table-data.model';
import { DropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/models';

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
    textLastShop: RepairShopPMResponse;
    lastService: string;
    textRepairShop: string;
    textRepairShopAddress: string;
    textMake: string;
    textModel?: string;
    textYear?: number;
    truckTypeClass: string;
    truckTypeIcon: string;
    tableTruckName: string;
    truckType: TruckTypeResponse;
    tableTruckColor: string;
    note?: string;
    tableDropdownContent: DropdownMenuItem[];
    truck: TruckShortResponse;
    pmId: number;
    id: number;
}
