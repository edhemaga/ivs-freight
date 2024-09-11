import { Pipe, PipeTransform } from '@angular/core';
import { TruckResponse } from 'appcoretruckassist';

@Pipe({
    name: 'hiddenAddTrailerPipe',
})
export class DispatchHiddenAddTrailerPipe implements PipeTransform {
    transform(isTrailerAddNewHidden: boolean, truck: TruckResponse) {
        return (
            isTrailerAddNewHidden ||
            truck?.truckType.id === 2 ||
            truck?.truckType.id === 5
        );
    }
}
