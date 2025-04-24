import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pendingLoadProgress',
    standalone: true,
})
export class PendingLoadProgressPipe implements PipeTransform {
    transform(percent: number): string {
        let backgroundColor;
        if (percent <= 50) {
            backgroundColor = 'muted';
        } else if (percent > 50 && percent <= 80) {
            backgroundColor = 'yellow-1';
        } else {
            backgroundColor = 'red-10';
        }

        return backgroundColor;
    }
}
