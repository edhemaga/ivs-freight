import { Tabs } from "@shared/models/tabs.model";
import { OpenHourDays, RepairShopModalEnum, WorkingHoursType } from "../../enums/repair-shop-modal.enum";

export class RepairShopConstants {
    static OPEN_HOUR_DAYS: WorkingHoursType = [
        OpenHourDays.MON_FRI,
        OpenHourDays.Sunday,
        OpenHourDays.Monday,
        OpenHourDays.Tuesday,
        OpenHourDays.Wednesday,
        OpenHourDays.Thursday,
        OpenHourDays.Friday,
        OpenHourDays.Saturday,
    ];
    
    static TABS(isAddMode: boolean): Tabs[] {
        const tabs = [
            {
                id: 1,
                name: RepairShopModalEnum.TAB_TITLE_DETAILS,
                checked: true,
            },
            {
                id: 2,
                name: RepairShopModalEnum.TAB_TITLE_CONTACT,
                checked: false,
            },
            {
                id: 3,
                name: RepairShopModalEnum.TAB_TITLE_REVIEW,
                checked: false,
            }
        ];

        if (isAddMode) {
            return tabs.slice(0, -1);
        }

        return tabs;
    }
}