export class TimespanConvertHelper {
    public static convertTimeSpanToMinutes(timespan): number {
        let totalMinutes = 0;

        if (!timespan) return totalMinutes;

        let timeArr = JSON.stringify(timespan);

        timeArr = JSON.parse(timeArr).split('.');

        if (timeArr.length > 1) {
            const days = Number(timeArr[0]);
            let hoursAndMinutes = timeArr[1].split(':');
            const hours = Number(hoursAndMinutes[0]) + days * 24;
            const minutes = Number([hoursAndMinutes[1]]);

            totalMinutes = hours * 60 + minutes;
        } else {
            let hoursAndMinutes = timeArr[0].split(':');
            const hours = Number(hoursAndMinutes[0]);
            const minutes = Number([hoursAndMinutes[1]]);
            totalMinutes = hours * 60 + minutes;
        }

        return totalMinutes;
    }
}