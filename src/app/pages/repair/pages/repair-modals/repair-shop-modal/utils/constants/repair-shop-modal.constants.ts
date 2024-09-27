// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Enums
import { OpenHourDays, OpenWorkingHours } from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';

// Models
import { OpenHours } from '@pages/repair/pages/repair-modals/repair-shop-modal/models';

export type WorkingHoursType = OpenHourDays[];

const startTime = MethodsCalculationsHelper.convertTimeFromBackend(
    OpenWorkingHours.EIGHTAM
);
const endTime = MethodsCalculationsHelper.convertTimeFromBackend(
    OpenWorkingHours.FIVEAM
);

export class RepairShopConstants {
    static OPEN_HOUR_DAYS: WorkingHoursType = [
        OpenHourDays.Sunday,
        OpenHourDays.Monday,
        OpenHourDays.Tuesday,
        OpenHourDays.Wednesday,
        OpenHourDays.Thursday,
        OpenHourDays.Friday,
        OpenHourDays.Saturday,
    ];

    static DEFAULT_OPEN_HOUR_DAYS: OpenHours[] = [
        {
            dayLabel: OpenHourDays.Monday,
            dayOfWeek: 1,
            isWorkingDay: true,
            startTime,
            endTime,
            isDoubleShift: false,
            secondEndTime: endTime,
            secondStartTime: startTime
        },
        {
            dayLabel: OpenHourDays.Tuesday,
            dayOfWeek: 2,
            isWorkingDay: true,
            startTime,
            endTime,
            isDoubleShift: false,
            secondEndTime: endTime,
            secondStartTime: startTime
        },
        {
            dayLabel: OpenHourDays.Wednesday,
            dayOfWeek: 3,
            isWorkingDay: true,
            startTime,
            endTime,
            isDoubleShift: false,
            secondEndTime: endTime,
            secondStartTime: startTime
        },
        {
            dayLabel: OpenHourDays.Thursday,
            dayOfWeek: 4,
            isWorkingDay: true,
            startTime,
            endTime,
            isDoubleShift: false,
            secondEndTime: endTime,
            secondStartTime: startTime
        },
        {
            dayLabel: OpenHourDays.Friday,
            dayOfWeek: 5,
            isWorkingDay: true,
            startTime,
            endTime,
            isDoubleShift: false,
            secondEndTime: endTime,
            secondStartTime: startTime
        },
        {
            dayLabel: OpenHourDays.Saturday,
            dayOfWeek: 6,
            isWorkingDay: false,
            startTime: null,
            endTime: null,
            isDoubleShift: false,
            secondEndTime: null,
            secondStartTime: null
        },
        {
            dayLabel: OpenHourDays.Sunday,
            dayOfWeek: 0,
            isWorkingDay: false,
            startTime: null,
            endTime: null,
            isDoubleShift: false,
            secondEndTime: null,
            secondStartTime: null
        },
    ];
}
