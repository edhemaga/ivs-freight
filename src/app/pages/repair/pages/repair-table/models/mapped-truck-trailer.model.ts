import {
    FileResponse,
    RepairItemResponse,
    RepairServiceTypeResponse,
} from 'appcoretruckassist';
import { DropdownItem } from '@shared/models/dropdown-item.model';

export interface MappedTruckTrailer {
    invoice: string;
    isSelected: boolean;
    isRepairOrder: boolean;
    tableUnit?: string;
    tableType: string;
    tableMake: string;
    tableNumber: string;
    tableModel: string;
    fileCount?: number | null;
    tableYear: string;
    payType: string;
    tableOdometer: string;
    driver: string;
    tableIssued: string;
    tableShopName: string;
    tableShopAdress: string;
    tableServices: RepairServiceTypeResponse[];
    tableDescription: RepairItemResponse[];
    tabelDescriptionDropTotal: string;
    tableCost: string;
    tableAdded: string;
    tableEdited: string;
    tableAttachments: FileResponse[];
    tableDropdownContent: {
        hasContent: boolean;
        content: DropdownItem[];
    };
    descriptionItems: Array<RepairItemResponse>;
}
