import { Pipe, PipeTransform } from '@angular/core';

// constants
import { DispatchConstants } from 'src/app/pages/dispatch/utils/constants/dispatch.constants';

// models
import { TruckTrailer } from '../models/truck-trailer.model';

@Pipe({
    name: 'colorFinder',
})
export class ColorFinderPipe implements PipeTransform {
    transform(value: string, id: number): string {
        let searchInArray: TruckTrailer[] | TruckTrailer[] =
            DispatchConstants.TRAILER_TYPES;

        if (value === 'truck') searchInArray = DispatchConstants.TRUCK_TYPES;

        const findedColor = searchInArray.find((item) => item.id == id);

        if (findedColor) return findedColor.color;

        return '';
    }
}
