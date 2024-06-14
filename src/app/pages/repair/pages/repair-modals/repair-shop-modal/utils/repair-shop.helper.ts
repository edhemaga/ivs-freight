import { RepairShopResponse } from 'appcoretruckassist';
import { RepairShopModalService } from '../models/repair-shop-modal-services.model';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { OpenHours } from '../models/repair-shop-open-hours.model';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { RepairShopModalEnum } from '../enums/repair-shop-modal.enum';
import { RepairShopTabs } from '../models/repair-shop-modal-tabs.model';
import { OpenedTab } from '../types/open-tabs.type';

export class RepairShopHelper {
    static TABS(isAddMode: boolean, openedTab: OpenedTab): RepairShopTabs[] {
        const tabs = [
            {
                id: TableStringEnum.DETAILS as OpenedTab,
                name: RepairShopModalEnum.TAB_TITLE_DETAILS,
                checked: TableStringEnum.DETAILS === openedTab,
            },
            {
                id: TableStringEnum.CONTACT as OpenedTab,
                name: RepairShopModalEnum.TAB_TITLE_CONTACT,
                checked: TableStringEnum.CONTACT === openedTab,
            },
            {
                id: TableStringEnum.REVIEW as OpenedTab,
                name: RepairShopModalEnum.TAB_TITLE_REVIEW,
                checked: TableStringEnum.REVIEW === openedTab,
            },
        ];

        if (isAddMode) {
            return tabs.slice(0, -1);
        }

        return tabs;
    }

    static mapServices(
        res: RepairShopResponse,
        setAsInactive: boolean
    ): RepairShopModalService[] {
        // TODO: TYPE
        return res.serviceTypes.map((item) => {
            return {
                id: item.serviceType.id,
                serviceType: item.serviceType.name,
                svg: `assets/svg/common/repair-services/${item.logoName}`,
                active: setAsInactive ? false : item.active,
            };
        });
    }

    static createOpenHour(
        day: OpenHours,
        formBuilder: UntypedFormBuilder
    ): UntypedFormGroup {
        return formBuilder.group({
            isWorkingDay: [day.isWorkingDay],
            dayLabel: [day.dayLabel],
            startTime: [day.startTime],
            endTime: [day.endTime],
        });
    }
}
