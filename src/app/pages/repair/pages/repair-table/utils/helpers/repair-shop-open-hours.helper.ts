// Models
import { RepairShopListDto } from 'appcoretruckassist';

// Moment
import moment from 'moment';

export class RepairShopOpenHoursHelper {
    static getRepairShopOpenHours(
        repairShop: RepairShopListDto
    ): { name: string; value: string }[] {
        let openHours: { name: string; value: string }[] = [];

        if (repairShop.openAlways) {
            openHours.push({ name: 'Open Now', value: '24/7' });
            openHours.push({ name: 'Monday-Sunday', value: '24/7' });
        } else {
            const daysByOpenHours = {};

            repairShop.openHours.forEach((day) => {
                const workTime = day.startTime
                    ? day.startTime.substring(0, 5) +
                      '-' +
                      day.endTime.substring(0, 5)
                    : 'Closed';

                if (!daysByOpenHours[workTime]) daysByOpenHours[workTime] = [];

                daysByOpenHours[workTime].push({
                    day: day.dayOfWeek,
                    value: workTime,
                });
            });

            console.log(
                'getRepairShopOpenHours daysByOpenHours',
                daysByOpenHours
            );
        }

        return openHours;
    }
}
