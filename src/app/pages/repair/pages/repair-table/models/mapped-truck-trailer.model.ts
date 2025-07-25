// models
import {
    FileResponse,
    RepairItemResponse,
    RepairServiceTypeResponse,
} from 'appcoretruckassist';
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

export interface MappedRepair {
    tablePaid: string;
    isSelected: boolean;
    isRepairOrder: boolean;
    tableUnit: string;
    tableVehicleType: string;
    vehicleTypeClass: string;
    vehicleTooltipColor: string;
    vehicleTooltipTitle: string;
    tableMake: string;
    tableNumber: string;
    tableModel: string;
    fileCount: number | null;
    tableYear: number;
    tablePayType: string;
    tableOdometer: string;
    avatarImg: string;
    tableDriver: string;
    tableIssued: string;
    tableShopName: string;
    tableShopAdress: string;
    tableServiceType: string;
    tableServices: RepairServiceTypeResponse[];
    tableDescription: RepairItemResponse[];
    tableDescriptionSpecialStylesIndexArray: number[];
    tableDescriptionDropTotal: string;
    tableCost: string;
    tableAdded: string;
    tableEdited: string;
    tableAttachments: FileResponse[];
    tableDropdownContent: IDropdownMenuItem[];
}
