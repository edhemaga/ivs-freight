import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'colorFinder',
})
export class ColorFinderPipe implements PipeTransform {
    transform(id: number, type: string, isTooltip?: boolean): string {
        if (type === 'truck') {
            switch (id) {
                case 1:
                case 6:
                    if (isTooltip) return '#3B73ED';

                    return 'blue';
                case 2:
                case 5:
                    if (isTooltip) return '#F89B2E';

                    return 'yellow';
                default:
                    if (isTooltip) return '#259F94';

                    return 'green';
            }
        } else {
        }
    }
}
