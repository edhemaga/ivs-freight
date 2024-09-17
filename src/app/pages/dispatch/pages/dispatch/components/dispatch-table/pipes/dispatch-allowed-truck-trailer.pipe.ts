import { Pipe, PipeTransform } from '@angular/core';
import { AllowedTruckTrailer } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/allowed-truck-trailer.model';

@Pipe({
    name: 'allowedTruckTrailer',
})
export class DispatchAllowedTruckTrailerPipe implements PipeTransform {
    transform<T extends AllowedTruckTrailer>(
        list: T[],
        truckTrailerId: number
    ) {
        console.log('list', list);
        console.log('truckId', truckTrailerId);

        return list?.filter((trailer) => trailer.allowedTruckIds);

        /*   if (!truckTrailerId) return list;

        return isTruckList
            ? list?.filter((truck) => truck.allowedTrailerIds)
            : list?.filter((trailer) => trailer.allowedTruckIds); */
    }
}
