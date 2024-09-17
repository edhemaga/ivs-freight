import { Pipe, PipeTransform } from '@angular/core';
import { AllowedTruckTrailer } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/allowed-truck-trailer.model';
import { TrailerDispatchModalResponse } from 'appcoretruckassist';

@Pipe({
    name: 'allowedTruckTrailer',
})
export class DispatchAllowedTruckTrailerPipe implements PipeTransform {
    transform /* <T extends AllowedTruckTrailer> */(
        trailerList: TrailerDispatchModalResponse[],
        allowedTrailerIds: number[]
    ) {
        console.log('trailerList', trailerList);
        console.log('allowedTrailerIds', allowedTrailerIds);

        return trailerList?.filter((trailer) =>
            allowedTrailerIds?.includes(trailer.id)
        );

        /*   if (!truckTrailerId) return list;

        return isTruckList
            ? list?.filter((truck) => truck.allowedTrailerIds)
            : list?.filter((trailer) => trailer.allowedTruckIds); */
    }
}
