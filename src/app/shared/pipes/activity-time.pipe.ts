import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'activityTime',
    standalone: true,
})
export class ActivityTimePipe implements PipeTransform {
    transform(value: Date | string | number): string {
        const currentTime = new Date().getTime();
        const givenTime = new Date(new Date(value).toUTCString()).getTime();;
        const diffInSeconds = Math.floor((currentTime - givenTime) / 1000);

        if (diffInSeconds < 600)
            return 'Online';
        else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
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
