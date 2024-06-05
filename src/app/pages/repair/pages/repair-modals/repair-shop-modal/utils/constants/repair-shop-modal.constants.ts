import {
    OpenHourDays,
    OpenWorkingHours,
    RepairShopModalEnum,
    WorkingHoursType,
} from '../../enums/repair-shop-modal.enum';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { OpenedTab, RepairShopTabs } from '../../models/edit-data.model';

const startTime = MethodsCalculationsHelper.convertTimeFromBackend(
    OpenWorkingHours.EIGHTAM
);
const endTime = MethodsCalculationsHelper.convertTimeFromBackend(
    OpenWorkingHours.FIVEAM
);

export enum RepairShopModalStringEnum {
    OPEN_HOURS = 'openHours',
    START_TIME = 'startTime',
    END_TIME = 'endTime',
    IS_WORKING_DAY = 'isWorkingDay',
    OPEN_ALWAYS = 'openAlways',
    PINNED = 'pinned',
    SELECTED_ADDRESS = 'selectedAddress',
    LONGITUDE = 'longitude',
    LATITUDE = 'latitude',
    SHOP_SERVICE_TYPE = 'shopServiceType',
    BANK_ID = 'bankId',
    FILES = 'files',
    CONTACTS = 'contacts'
}

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

    static DEFAULT_OPEN_HOUR_DAYS = [
        {
            dayLabel: OpenHourDays.MON_FRI,
            dayOfWeek: -1,
            isWorkingDay: true,
            startTime,
            endTime,
        },
        {
            dayLabel: OpenHourDays.Monday,
            dayOfWeek: 1,
            isWorkingDay: true,
            startTime,
            endTime,
        },
        {
            dayLabel: OpenHourDays.Tuesday,
            dayOfWeek: 2,
            isWorkingDay: true,
            startTime,
            endTime,
        },
        {
            dayLabel: OpenHourDays.Wednesday,
            dayOfWeek: 3,
            isWorkingDay: true,
            startTime,
            endTime,
        },
        {
            dayLabel: OpenHourDays.Thursday,
            dayOfWeek: 4,
            isWorkingDay: true,
            startTime,
            endTime,
        },
        {
            dayLabel: OpenHourDays.Friday,
            dayOfWeek: 5,
            isWorkingDay: true,
            startTime,
            endTime,
        },
        {
            dayLabel: OpenHourDays.Saturday,
            dayOfWeek: 6,
            isWorkingDay: false,
            startTime: null,
            endTime: null,
        },
        {
            dayLabel: OpenHourDays.Sunday,
            dayOfWeek: 0,
            isWorkingDay: false,
            startTime: null,
            endTime: null,
        },
    ];

    static TABS(isAddMode: boolean, openedTab: OpenedTab): RepairShopTabs[] {
        const tabs = [
            {
                id: TableStringEnum.DETAILS as OpenedTab,
                name: RepairShopModalEnum.TAB_TITLE_DETAILS,
                checked: TableStringEnum.DETAILS === openedTab,
            },
            {
                id: TableStringEnum.CONTRACT as OpenedTab,
                name: RepairShopModalEnum.TAB_TITLE_CONTACT,
                checked: TableStringEnum.CONTRACT === openedTab,
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
}
