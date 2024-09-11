import moment from 'moment';

export class DispatchHistoryModalDateHelper {
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
                return seconds ? seconds + 's' : '0s';
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
        dateEnd: string,
        isSameCheck: boolean = false
    ): boolean {
        const selectedGroupItemDateStart = moment(dateStart, 'MM/DD/YY');
        const previousGroupItemDateEnd = moment(dateEnd, 'MM/DD/YY');

        return isSameCheck
            ? selectedGroupItemDateStart.isSame(previousGroupItemDateEnd)
            : selectedGroupItemDateStart.isSame(previousGroupItemDateEnd) ||
                  selectedGroupItemDateStart.isAfter(previousGroupItemDateEnd);
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
        dateStart: string,
        isSameCheck: boolean = false
    ): boolean {
        const selectedGroupItemDateEnd = moment(dateEnd, 'MM/DD/YY');
        const nextGroupItemDateStart = moment(dateStart, 'MM/DD/YY');

        return isSameCheck
            ? selectedGroupItemDateEnd.isSame(nextGroupItemDateStart)
            : selectedGroupItemDateEnd.isSame(nextGroupItemDateStart) ||
                  selectedGroupItemDateEnd.isBefore(nextGroupItemDateStart);
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

    static checkIsTimeStartAfterOrSamePreviousTimeEnd(
        timeStart: string,
        previousTimeEnd: string
    ): boolean {
        const selectedGroupItemTimeStart = moment(timeStart, 'hh:mm A');
        const previousGroupItemTimeEnd = moment(previousTimeEnd, 'hh:mm A');

        const isTimeStartAfterOrSameAsTimeEnd =
            selectedGroupItemTimeStart.isAfter(previousGroupItemTimeEnd) ||
            selectedGroupItemTimeStart.isSame(previousGroupItemTimeEnd);

        return isTimeStartAfterOrSameAsTimeEnd;
    }

    static checkIsTimeEndBeforeOrSameNextTimeStart(
        timeEnd: string,
        nextTimeStart: string
    ): boolean {
        const selectedGroupItemTimeEnd = moment(timeEnd, 'hh:mm A');
        const nextGroupItemTimeStart = moment(nextTimeStart, 'hh:mm A');

        const isTimeEndBeforeOrSameAsTimeStart =
            selectedGroupItemTimeEnd.isBefore(nextGroupItemTimeStart) ||
            selectedGroupItemTimeEnd.isSame(nextGroupItemTimeStart);

        return isTimeEndBeforeOrSameAsTimeStart;
    }
}
