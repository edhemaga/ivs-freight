import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dispatchColorFinder',
    standalone: true,
})
export class DispatchColorFinderPipe implements PipeTransform {
    transform(id: number, type: string, isTooltip?: boolean): string {
        if (type === 'truck') {
            switch (id) {
                case 1:
                case 2:
                    if (isTooltip) return '#3B73ED';

                    return 'svg-fill-blue-14';
                case 3:
                case 4:
                case 5:
                    if (isTooltip) return '#F89B2E';

                    return 'svg-fill-yellow-5';
                case 6:
                case 7:
                case 8:
                    if (isTooltip) return '#DF3C3C ';

                    return 'svg-fill-red-11';
                default:
                    if (isTooltip) return '#259F94';

                    return 'svg-fill-green-2';
            }
        } else {
            switch (id) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    if (isTooltip) return '#3B73ED';

                    return 'svg-fill-blue-14';
                case 8:
                case 9:
                    if (isTooltip) return '#F89B2E';

                    return 'svg-fill-yellow-5';
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                    if (isTooltip) return '#DF3C3C ';

                    return 'svg-fill-red-11';
                default:
                    if (isTooltip) return '#259F94';

                    return 'svg-fill-green-2';
            }
        }
    }
}
