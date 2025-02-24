import { RepairShopOpenHoursResponse } from 'appcoretruckassist';

export class OpenHoursHelper {
    static createOpenHours(
        openHours: RepairShopOpenHoursResponse[]
    ): RepairShopOpenHoursResponse[] {
        let adjustedOpenHours = [];

        openHours?.forEach(
            ({ dayOfWeek, startTime, endTime, splitShiftTimes }) => {
                const workingHours = splitShiftTimes
                    ? `${splitShiftTimes[0].startSplitTime} - ${splitShiftTimes[0].endSplitTime}`
                    : `${startTime} - ${endTime}`;

                const workingHourItem = {
                    workingDays: dayOfWeek,
                    workingHours,
                    ...(splitShiftTimes && {
                        splitShiftWorkingHours: `${splitShiftTimes[1].startSplitTime} - ${splitShiftTimes[1].endSplitTime}`,
                    }),
                };

                adjustedOpenHours = [...adjustedOpenHours, workingHourItem];
            }
        );

        return adjustedOpenHours;
    }
}
