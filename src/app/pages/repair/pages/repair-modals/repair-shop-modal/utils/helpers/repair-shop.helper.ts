import { RepairShopResponse } from 'appcoretruckassist';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { RepairShopModalEnum } from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';
import { OpenedTab } from '@pages/repair/pages/repair-modals/repair-shop-modal/types';
import {
    OpenHours,
    RepairShopTabs,
    RepairShopModalService,
} from '@pages/repair/pages/repair-modals/repair-shop-modal/models';

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
            isDoubleShift: [day.isDoubleShift],
            secondStartTime: [day.secondStartTime],
            secondEndTime: [day.secondEndTime],
        });
    }
}
