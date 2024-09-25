import { Pipe, PipeTransform } from '@angular/core';
import { TruckResponse } from 'appcoretruckassist';

@Pipe({
    name: 'hiddenAddTrailer',
})
export class DispatchHiddenAddTrailerPipe implements PipeTransform {
    transform(truck: TruckResponse) {
        return (
            truck?.truckType.id === 3 ||
            truck?.truckType.id === 4 ||
            truck?.truckType.id === 5 ||
            truck?.truckType.id === 6 ||
            truck?.truckType.id === 7 ||
            truck?.truckType.id === 8
        );
    }
}
