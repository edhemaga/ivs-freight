import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatDuration',
    standalone: true,
})
export class FormatDurationPipe implements PipeTransform {
    transform(
        time: { days: number; hours: number; minutes: number; seconds: number },
        showDaysAgo: boolean = false // Boolean input to decide whether to show "days ago"
    ): string {
        // Define time units with singular and plural labels
        const timeUnits = [
            { value: time.days, label: 'day', labelPlural: 'days' },
            { value: time.hours, label: 'hour', labelPlural: 'hours' },
            { value: time.minutes, label: 'minute', labelPlural: 'minutes' },
            { value: time.seconds, label: 'second', labelPlural: 'seconds' },
        ];

        // Filter out units with zero values
        const filteredUnits = timeUnits.filter((unit) => unit.value > 0);

        // If we need to show "days ago"
        if (showDaysAgo) {
            // Get the largest time unit (day, hour, minute, second)
            const largestUnit = filteredUnits[0];

            // Return the largest unit with the "ago" suffix
            const label =
                largestUnit.value === 1
                    ? largestUnit.label
                    : largestUnit.labelPlural;
            return `${largestUnit.value} ${label} ago`;
        }

        // Otherwise, take the first two largest time units
        const topUnits = filteredUnits.slice(0, 2);

        // Format and return the result with proper singular or plural labels
        return topUnits
            .map((unit) => {
                const label = unit.value === 1 ? unit.label : unit.labelPlural;
                return `${unit.value} ${label}`;
            })
            .join(' ');
    }
}
