import { Pipe, PipeTransform } from '@angular/core';
import { eSharedString, eStringPlaceholder } from '@shared/enums';
import moment from 'moment';

@Pipe({
    name: 'activityTime',
    standalone: true,
})
export class ActivityTimePipe implements PipeTransform {
    transform(value: Date | string | number, type?: string): string {
        const backendTime = moment.utc(value).local().unix();
        const currentTime = moment().unix();
        const diffInSeconds = currentTime - backendTime;

        if(!value) return eStringPlaceholder.EMPTY;
        
        if (type === 'activity') if (diffInSeconds < 600) return eSharedString.ONLINE;

        if (diffInSeconds < 3600) {
            let minutes = Math.ceil(diffInSeconds / 60);
            return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days === 1 ? '' : 's'} ago`;
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months} month${months === 1 ? '' : 's'} ago`;
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return `${years} year${years === 1 ? '' : 's'} ago`;
        }
    }
}
