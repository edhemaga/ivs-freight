// Enums
import { OpenHourDays, OpenWorkingHours } from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';

// Models
import { OpenHours } from '@pages/repair/pages/repair-modals/repair-shop-modal/models';

export type WorkingHoursType = OpenHourDays[];

export class RepairShopConstants {
    static startTime =
        OpenWorkingHours.EIGHTAM
    static endTime = 
        OpenWorkingHours.FIVEAM
    static OPEN_HOUR_DAYS: WorkingHoursType = [
        OpenHourDays.Sunday,
        OpenHourDays.Monday,
        OpenHourDays.Tuesday,
        OpenHourDays.Wednesday,
        OpenHourDays.Thursday,
        OpenHourDays.Friday,
        OpenHourDays.Saturday,
    ];

    static Holiday: OpenHours = {
        dayOfWeek: OpenHourDays.Holiday,
        index: 7,
        isWorkingDay: false,
        startTime: RepairShopConstants.startTime,
        endTime: RepairShopConstants.endTime,
        isDoubleShift: false,
    }

    static DEFAULT_OPEN_HOUR_DAYS: OpenHours[] = [
        {
            dayOfWeek: OpenHourDays.Monday,
            index: 1,
            isWorkingDay: true,
            startTime: RepairShopConstants.startTime,
            endTime: RepairShopConstants.endTime,
            isDoubleShift: false,
        },
        {
            dayOfWeek: OpenHourDays.Tuesday,
            index: 2,
            isWorkingDay: true,
            startTime: RepairShopConstants.startTime,
            endTime: RepairShopConstants.endTime,
            isDoubleShift: false,
        },
        {
            dayOfWeek: OpenHourDays.Wednesday,
            index: 3,
            isWorkingDay: true,
            startTime: RepairShopConstants.startTime,
            endTime: RepairShopConstants.endTime,
            isDoubleShift: false,
        },
        {
            dayOfWeek: OpenHourDays.Thursday,
            index: 4,
            isWorkingDay: true,
            startTime: RepairShopConstants.startTime,
            endTime: RepairShopConstants.endTime,
            isDoubleShift: false,
        },
        {
            dayOfWeek: OpenHourDays.Friday,
            index: 5,
            isWorkingDay: true,
            startTime: RepairShopConstants.startTime,
            endTime: RepairShopConstants.endTime,
            isDoubleShift: false,
        },
        {
            dayOfWeek: OpenHourDays.Saturday,
            index: 6,
            isWorkingDay: false,
            startTime: RepairShopConstants.startTime,
            endTime: RepairShopConstants.endTime,
            isDoubleShift: false,
        },
        {
            dayOfWeek: OpenHourDays.Sunday,
            index: 0,
            isWorkingDay: false,
            startTime: RepairShopConstants.startTime,
            endTime: RepairShopConstants.endTime,
            isDoubleShift: false,
        },
        RepairShopConstants.Holiday,
    ];
}
