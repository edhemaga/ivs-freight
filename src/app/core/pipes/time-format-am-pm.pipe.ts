// time-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeFormat',
    standalone: true,
})
export class TimeFormatPipe implements PipeTransform {
    transform(timeRange: string): string {
        if (!timeRange) {
            return ''; // or handle it as you see fit
        }

        const [startTime, endTime] = timeRange.split(' - ');

        const formattedStartTime = this.formatTime(startTime);
        const formattedEndTime = this.formatTime(endTime);

        return `${formattedStartTime} - ${formattedEndTime}`;
    }

    private formatTime(time: string): string {
        if (!time) {
            return ''; // or handle it as you see fit
        }

        const [hour, minute] = time.split(':');

        if (hour === undefined || minute === undefined) {
            return ''; // or handle it as you see fit
        }

        const numericHour = +hour;
        const numericMinute = +minute;

        if (isNaN(numericHour) || isNaN(numericMinute)) {
            return ''; // or handle it as you see fit
        }

        const period = numericHour < 12 ? 'AM' : 'PM';

        const formattedHour = (numericHour % 12 === 0 ? 12 : numericHour % 12)
            .toString()
            .padStart(2, '0');

        return `${formattedHour}:${numericMinute
            .toString()
            .padStart(2, '0')} ${period}`;
    }
}
