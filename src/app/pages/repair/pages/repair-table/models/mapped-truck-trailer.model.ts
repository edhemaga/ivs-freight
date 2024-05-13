import {
    FileResponse,
    RepairItemResponse,
    RepairResponse,
    RepairServiceTypeResponse,
} from 'appcoretruckassist';
import { DropdownItem } from '@shared/models/dropdown-item.model';

export interface MappedTruckTrailer extends RepairResponse {
    isSelected: boolean;
    isRepairOrder: boolean;
    tableUnit: string;
    tableType: string;
    tableMake: string;
    tableModel: string;
    tableYear: string;
    tableOdometer: string;
    tableIssued: string;
    tableShopName: string;
    tableShopAdress: string;
    tableServices: RepairServiceTypeResponse[];
    tableDescription: string;
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
