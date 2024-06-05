import { Tabs } from '@shared/models/tabs.model';
import {
    OpenHourDays,
    OpenWorkingHours,
    RepairShopModalEnum,
    WorkingHoursType,
} from '../../enums/repair-shop-modal.enum';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

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
            startTime: MethodsCalculationsHelper.convertTimeFromBackend(
                OpenWorkingHours.EIGHTAM
            ),
            endTime: MethodsCalculationsHelper.convertTimeFromBackend(
                OpenWorkingHours.FIVEAM
            ),
        },
        {
            dayLabel: OpenHourDays.Monday,
            dayOfWeek: 1,
            isWorkingDay: true,
            startTime: MethodsCalculationsHelper.convertTimeFromBackend(
                OpenWorkingHours.EIGHTAM
            ),
            endTime: MethodsCalculationsHelper.convertTimeFromBackend(
                OpenWorkingHours.FIVEAM
            ),
        },
        {
            dayLabel: OpenHourDays.Tuesday,
            dayOfWeek: 2,
            isWorkingDay: true,
            startTime: MethodsCalculationsHelper.convertTimeFromBackend(
                OpenWorkingHours.EIGHTAM
            ),
            endTime: MethodsCalculationsHelper.convertTimeFromBackend(
                OpenWorkingHours.FIVEAM
            ),
        },
        {
            dayLabel: OpenHourDays.Wednesday,
            dayOfWeek: 3,
            isWorkingDay: true,
            startTime: MethodsCalculationsHelper.convertTimeFromBackend(
                OpenWorkingHours.EIGHTAM
            ),
            endTime: MethodsCalculationsHelper.convertTimeFromBackend(
                OpenWorkingHours.FIVEAM
            ),
        },
        {
            dayLabel: OpenHourDays.Thursday,
            dayOfWeek: 4,
            isWorkingDay: true,
            startTime: MethodsCalculationsHelper.convertTimeFromBackend(
                OpenWorkingHours.EIGHTAM
            ),
            endTime: MethodsCalculationsHelper.convertTimeFromBackend(
                OpenWorkingHours.FIVEAM
            ),
        },
        {
            dayLabel: OpenHourDays.Friday,
            dayOfWeek: 5,
            isWorkingDay: true,
            startTime: MethodsCalculationsHelper.convertTimeFromBackend(
                OpenWorkingHours.EIGHTAM
            ),
            endTime: MethodsCalculationsHelper.convertTimeFromBackend(
                OpenWorkingHours.FIVEAM
            ),
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
            },
        ];

        if (isAddMode) {
            return tabs.slice(0, -1);
        }

        return tabs;
    }
}
