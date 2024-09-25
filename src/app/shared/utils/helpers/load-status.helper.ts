import { LastStatusPassed } from '@shared/models/card-models/card-table-data.model';

export class LoadStatusHelper {
    static calculateStatusTime(lastStatusPassed: LastStatusPassed): string {
        if(!lastStatusPassed) return '';
        
        const { days, hours, minutes, seconds } = lastStatusPassed;

        // If the change just occurred in less than 5 minutes
        if (
            days === 0 &&
            hours === 0 &&
            (minutes < 5 || (minutes === 5 && seconds === 0))
        )
            return 'Just Now';

        // If the change happened in the last 24 hours
        if (days === 0) {
            // Round minutes down to nearest 5-minute interval
            const roundedMinutes = Math.floor(minutes / 5) * 5;
            return `${hours}:${
                roundedMinutes < 10 ? '0' + roundedMinutes : roundedMinutes
            }`;
        }

        // If the change happened more than 24 hours but less than 25 hours
        if (days >= 1 && hours < 1) return `${days}D : 0H`;

        // If the change happened more than 24 hours
        return `${days}D : ${hours}H`;
    }
}
