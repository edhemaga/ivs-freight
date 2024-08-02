import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

export class DispatchHistoryModalHelper {
    static roundToNearestQuarterHour(time: string): string {
        const convertedTime = time
            ? MethodsCalculationsHelper.convertDateFromBackendToTime(time)
            : null;

        if (convertedTime) {
            const [hours, minutesWithPmAm] = convertedTime.split(':');
            const [minutes, amPm] = minutesWithPmAm.split(' ');

            const quarterHours = Math.round(+minutes / 5);

            const roundedMinutes = quarterHours * 5;
            const roundedHours =
                roundedMinutes === 60 ? (+hours + 1) % 24 : hours;

            return `${String(roundedHours).padStart(2, '0')}:${String(
                roundedMinutes % 60
            ).padStart(2, '0')} ${amPm}`;
        }

        return convertedTime;
    }
}
