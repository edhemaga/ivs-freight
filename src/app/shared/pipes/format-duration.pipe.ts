import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatDuration',
    standalone: true,
})
export class FormatDurationPipe implements PipeTransform {
    transform(
        time: { days: number; hours: number; minutes: number; seconds: number },
        showDaysAgo: boolean = false,
        short: boolean = false
    ): string {
        const timeUnits = [
            {
                value: time.days,
                label: 'day',
                labelPlural: 'days',
                shortLabel: 'd',
            },
            {
                value: time.hours,
                label: 'hour',
                labelPlural: 'hours',
                shortLabel: 'h',
            },
            {
                value: time.minutes,
                label: 'minute',
                labelPlural: 'minutes',
                shortLabel: 'm',
            },
            {
                value: time.seconds,
                label: 'second',
                labelPlural: 'seconds',
                shortLabel: 's',
            },
        ];

        const filteredUnits = timeUnits.filter((unit) => unit.value > 0);

        if (filteredUnits.length === 0) {
            return short ? '0s' : '0 seconds';
        }

        if (showDaysAgo) {
            const largestUnit = filteredUnits[0];
            const label = short
                ? largestUnit.shortLabel
                : largestUnit.value === 1
                  ? largestUnit.label
                  : largestUnit.labelPlural;
            return short
                ? `${largestUnit.value}${label} ago`
                : `${largestUnit.value} ${label} ago`;
        }

        const topUnits = filteredUnits.slice(0, 2);
        return topUnits
            .map((unit) => {
                const label = short
                    ? unit.shortLabel
                    : unit.value === 1
                      ? unit.label
                      : unit.labelPlural;
                return short
                    ? `${unit.value}${label}`
                    : `${unit.value} ${label}`;
            })
            .join(short ? ' ' : ' ');
    }
}
