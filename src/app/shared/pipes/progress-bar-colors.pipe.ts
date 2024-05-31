import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'progressBarColors',
    standalone: true,
})
export class ProgressBarColors implements PipeTransform {
    transform(percentage: number, isInsideBar: boolean): string {
        let className = '';

        if (isInsideBar) {
            if (percentage >= 50 && percentage <= 100)
                className = 'bg-progress-sliver';
            else if (percentage >= 20 && percentage < 50)
                className = 'bg-progress-orange';
            else if (percentage > 0 && percentage < 20)
                className = 'bg-progress-danger';
        } else {
            if (!percentage) className = 'bg-expired-container';
            else if (percentage >= 50 && percentage < 100)
                className = 'bg-sliver-container';
            else if (percentage >= 20 && percentage < 50)
                className = 'bg-orange-container';
            else if (percentage > 0 && percentage < 20)
                className = 'bg-danger-container';
            else if (percentage === 100) {
                className = 'bg-inactive-container';
            }
        }

        return className;
    }
}
