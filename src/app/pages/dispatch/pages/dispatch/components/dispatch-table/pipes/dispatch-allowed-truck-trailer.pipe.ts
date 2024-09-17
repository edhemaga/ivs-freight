import { Pipe, PipeTransform } from '@angular/core';

// models
import {
    TrailerDispatchModalResponse,
    TruckDispatchModalResponse,
} from 'appcoretruckassist';

@Pipe({
    name: 'allowedTruckTrailer',
})
export class DispatchAllowedTruckTrailerPipe implements PipeTransform {
    transform(
        truckTrailerList: (
            | TruckDispatchModalResponse
            | TrailerDispatchModalResponse
        )[],
        allowedTruckTrailerIds: number[]
    ) {
        return truckTrailerList?.filter((item) =>
            allowedTruckTrailerIds?.includes(item.id)
        );
    }
}
