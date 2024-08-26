import moment from 'moment';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

export class DispatchHistoryModalDateHelper {
    static roundToNearestQuarterHour(time: string): string {
        const convertedTime = time
            ? MethodsCalculationsHelper.convertDateFromBackendToTime(time)
            : null;

        if (convertedTime) {
            const [hours, minutesWithPmAm] = convertedTime.split(':');
            const [minutes, amPm] = minutesWithPmAm.split(' ');

            const quarterHours = Math.round(+minutes / 15);

            const roundedMinutes = quarterHours * 15;
            const roundedHours =
                roundedMinutes === 60 ? (+hours + 1) % 24 : hours;

            return `${String(roundedHours).padStart(2, '0')}:${String(
                roundedMinutes % 60
            ).padStart(2, '0')} ${amPm}`;
        }

        return convertedTime;
    }

    static createTotalColumnValue(dateFrom: string, dateTo: string): string {
        if (!dateTo) {
            return 'Ongoing';
        } else {
            const from = moment(dateFrom);
            const to = moment(dateTo);

            const years = to.diff(from, 'years');
            from.add(years, 'years');

            const days = to.diff(from, 'days');
            from.add(days, 'days');

            const hours = to.diff(from, 'hours');
            from.add(hours, 'hours');

            const minutes = to.diff(from, 'minutes');

            const seconds = to.diff(from, 'seconds');

            if (!years && !days && !hours && !minutes) {
                return seconds ? seconds + 's' : '1s';
            } else {
                const totalResult = `${years ? years + 'y' : ''} ${
                    days ? days + 'd' : ''
                } ${hours ? hours + 'h' : ''} ${
                    minutes ? minutes + 'm' : ''
                }`.trim();

                const matches = totalResult.match(/(\d+\w)\s*/g);

                return matches ? matches.slice(0, 2).join(' ') : '';
            }
        }
    }

    static createDateAndTimeFormat(date: string, time: string): string {
        const combinedDateTime = moment(
            `${date} ${time}`,
            'MM/DD/YY hh:mm A'
        ).format('YYYY-MM-DDTHH:mm:ss.SSSSSS');

        return combinedDateTime;
    }

    static checkIsSelectedDateSameOrAfterPreviousDate(
        dateStart: string,
        dateEnd: string
    ): boolean {
        const selectedGroupItemDateStart = moment(dateStart, 'MM/DD/YY');

        const previousGroupItemDateEnd = moment(dateEnd, 'MM/DD/YY');

        const isSelectedDateSameOrAfterPreviousDate =
            selectedGroupItemDateStart.isSame(previousGroupItemDateEnd) ||
            selectedGroupItemDateStart.isAfter(previousGroupItemDateEnd);

        return isSelectedDateSameOrAfterPreviousDate;
    }

    static checkIsSelectedDateBeforeOrSameAsSelectedGroupItemDateEnd(
        dateStart: string,
        dateEnd: string
    ): {
        isSelectedDateBeforeSelectedGroupItemDateEnd: boolean;
        isSelectedDateSameAsSelectedGroupItemDateEnd: boolean;
    } {
        const selectedGroupItemDateStart = moment(dateStart, 'MM/DD/YY');

        const selectedGroupItemDateEnd = moment(dateEnd, 'MM/DD/YY');

        const isSelectedDateBeforeSelectedGroupItemDateEnd =
            selectedGroupItemDateStart.isBefore(selectedGroupItemDateEnd);

        const isSelectedDateSameAsSelectedGroupItemDateEnd =
            selectedGroupItemDateStart.isSame(selectedGroupItemDateEnd);

        return {
            isSelectedDateBeforeSelectedGroupItemDateEnd,
            isSelectedDateSameAsSelectedGroupItemDateEnd,
        };
    }

    static checkIsTimeStartBeforeOrSameTimeEnd(
        timeStart: string,
        timeEnd: string
    ): boolean {
        const selectedGroupItemTimeStart = moment(timeStart, 'hh:mm A');
        const selectedGroupItemTimeEnd = moment(timeEnd, 'hh:mm A');

        const isTimeStartBeforeOrSameTimeEnd =
            selectedGroupItemTimeStart.isBefore(selectedGroupItemTimeEnd) ||
            selectedGroupItemTimeStart.isSame(selectedGroupItemTimeEnd);

        return isTimeStartBeforeOrSameTimeEnd;
    }

    static checkIsSelectedDateSameOrBeforeNextDate(
        dateEnd: string,
        dateStart: string
    ): boolean {
        const selectedGroupItemDateEnd = moment(dateEnd, 'MM/DD/YY');

        const nextGroupItemDateStart = moment(dateStart, 'MM/DD/YY');

        const isSelectedDateSameOrAfterPreviousDate =
            selectedGroupItemDateEnd.isSame(nextGroupItemDateStart) ||
            selectedGroupItemDateEnd.isBefore(nextGroupItemDateStart);

        return isSelectedDateSameOrAfterPreviousDate;
    }

    static checkIsSelectedDateAfterOrSameAsSelectedGroupItemDateStart(
        dateEnd: string,
        dateStart: string
    ): {
        isSelectedDateAfterSelectedGroupItemDateStart: boolean;
        isSelectedDateSameAsSelectedGroupItemDateStart: boolean;
    } {
        const selectedGroupItemDateEnd = moment(dateEnd, 'MM/DD/YY');

        const selectedGroupItemDateStart = moment(dateStart, 'MM/DD/YY');

        const isSelectedDateAfterSelectedGroupItemDateStart =
            selectedGroupItemDateEnd.isAfter(selectedGroupItemDateStart);

        const isSelectedDateSameAsSelectedGroupItemDateStart =
            selectedGroupItemDateEnd.isSame(selectedGroupItemDateStart);

        return {
            isSelectedDateAfterSelectedGroupItemDateStart,
            isSelectedDateSameAsSelectedGroupItemDateStart,
        };
    }
}
