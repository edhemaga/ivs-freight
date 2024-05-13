import {
    EnumValue,
    FileResponse,
    RepairItemResponse,
    RepairServiceTypeResponse,
    RepairShopShortResponse,
    TrailerMinimalResponse,
    TruckMinimalResponse,
} from 'appcoretruckassist';

export interface RepairBody {
    id?: number;
    companyId?: number;
    repairType?: EnumValue;
    unitType?: EnumValue;
    truckId?: number | null;
    truck?: TruckMinimalResponse;
    trailerId?: number | null;
    trailer?: TrailerMinimalResponse;
    odometer?: number | null;
    status?: number | null;
    date?: string | null;
    invoice?: string | null;
    repairShop?: RepairShopShortResponse;
    total?: number | null;
    serviceTypes?: Array<RepairServiceTypeResponse> | null;
    note?: string | null;
    createdAt?: string;
    updatedAt?: string;
    items?: Array<RepairItemResponse> | null;
    files?: Array<FileResponse> | null;
    fileCount?: number | null;
}
