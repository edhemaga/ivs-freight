import { Pipe, PipeTransform } from '@angular/core';

// constants
import { DispatchConstants } from '@pages/dispatch/utils/constants/dispatch.constants';

@Pipe({
    name: 'colorFinder',
})
export class ColorFinderPipe implements PipeTransform {
    transform(value: string, id: number): string {
        const searchInArray =
            value === 'truck'
                ? DispatchConstants.TRUCK_TYPES
                : DispatchConstants.TRAILER_TYPES;

        const findedColor = searchInArray.find((item) => item.id == id);

        if (findedColor) return findedColor.color;

        return '';
    }
}
