// models
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';
import {
    OpenHoursTodayResponse,
    RepairShopContactListResponse,
    RepairShopListDto,
    RepairShopOpenHoursResponse,
    RepairShopServiceTypeResponse,
} from 'appcoretruckassist';

export interface MappedRepairShop extends RepairShopListDto {
    isSelected: boolean;
    tableAddress: string;
    tableShopServiceType: string;
    tableShopServices: RepairShopServiceTypeResponse[];
    tableOpenHours: {
        openHours: RepairShopOpenHoursResponse[];
        openHoursToday: OpenHoursTodayResponse;
    };
    tableRepairCountBill: number;
    tableRepairCountOrder: number;
    tableBankDetailsBankName: string;
    tableBankDetailsRouting: string;
    tableBankDetailsAccount: string;
    tableRaiting: {
        hasLiked: boolean;
        hasDislike: boolean;
        likeCount: number;
        dislikeCount: number;
    };
    tableContactData: RepairShopContactListResponse[];
    tableExpense: string;
    tableLastUsed: string;
    tableDeactivated: string;
    tableAdded: string;
    tableEdited: string;
    isFavorite: boolean;
    isFavoriteDisabled: boolean;
    tableDropdownContent: IDropdownMenuItem[];
}
