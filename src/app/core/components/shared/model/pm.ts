import { TruckTypeResponse } from "appcoretruckassist";
import { AdditionalData } from "./company";
import { DropdownItem, PmTrailerProgressData, PmTruckProgressData } from "src/app/shared/models/card-table-data.model";

export interface Truck {
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
    additionalData: AdditionalData;
    tableDropdownContent: {
        hasContent: boolean;
        content: DropdownItem[];
    };
}

export interface Trailer {
    textUnit: string;
    textOdometer: string;
    lastService: string;
    repairShop: string;
    ruMake: string;
    alignment?: PmTrailerProgressData;
    general?: PmTrailerProgressData;
    ptoPump?: PmTrailerProgressData;
    reeferUnit?: PmTrailerProgressData;
    tableTrailerTypeIcon: string;
    tableTrailerName: string;
    tableTrailerColor: string;
    tableTrailerTypeClass: string;
    additionalData: AdditionalData;
    tableDropdownContent: {
        hasContent: boolean;
        content: DropdownItem[];
    };
}
