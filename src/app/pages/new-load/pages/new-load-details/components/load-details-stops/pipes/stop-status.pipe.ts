import { Pipe, PipeTransform } from '@angular/core';

// Models
import { LoadStopResponse } from 'appcoretruckassist';

@Pipe({
    name: 'stopStatus',
    standalone: true,
})
export class StopStatusPipe implements PipeTransform {
    transform(
        stop: LoadStopResponse,
        isPickup: boolean,
        isDelivery: boolean,
        isDeadhead: boolean
    ): string {
        if (!stop) return '';

        const classes: string[] = [];

        if (!stop.arrive) {
            classes.push('text-color-white');
        }

        if (isDeadhead) {
            classes.push('background-dark-2 text-color-bw6-2');
        }

        if (isDelivery) {
            classes.push(
                stop.arrive
                    ? 'background-orange-8 text-color-orange-1'
                    : 'background-orange-4'
            );
        }

        if (isPickup) {
            classes.push(
                stop.arrive
                    ? 'background-green-7 text-color-green-2'
                    : 'background-green'
            );
        }

        return classes.join(' ');
    }
}
