import { Pipe, PipeTransform, TrackByFunction } from '@angular/core';

/**
 * TrackByPropertyPipe is used for trackBy specific parameter if passed, otherwise default value will return trackBy index
 * Example trackBy: ('type' | trackByProperty) or ('' | trackByProperty)
 */

@Pipe({
    name: 'trackByProperty',
    standalone: true,
})
export class TrackByPropertyPipe implements PipeTransform {
    transform<T>(parameter: string): TrackByFunction<T> {
        return (index: number, item: T) => {
            if (parameter) {
                return item[parameter];
            } else {
                return index;
            }
        };
    }
}
