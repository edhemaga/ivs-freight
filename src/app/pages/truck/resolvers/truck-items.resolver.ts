import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable, forkJoin, tap } from 'rxjs';

// services
import { TruckService } from '@shared/services/truck.service';

// store
import {
    TruckItemState,
    TruckItemStore,
} from '@pages/truck/state/truck-details-state/truck.details.store';
import { TrucksDetailsListStore } from '@pages/truck/state/truck-details-list-state/truck-details-list.store';

@Injectable({
    providedIn: 'root',
})
export class TruckItemsResolver  {
    constructor(
        private truckService: TruckService,
        private truckDetailsStore: TruckItemStore,

        private truckDetailsListStore: TrucksDetailsListStore
    ) {}
    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<TruckItemState> | Observable<any> {
        const truck_id = route.paramMap.get('id');
        let trid = parseInt(truck_id);

        const truckData$ = this.truckService.getTruckById(trid);

        const truckRegistration$ =
            this.truckService.getTruckRegistrationsById(trid);

        const truckInspection$ =
            this.truckService.getTruckInspectionsById(trid);

        const truckTitles$ = this.truckService.getTruckTitlesById(trid);

        return forkJoin({
            truckData: truckData$,
            truckRegistrations: truckRegistration$,
            truckInspection: truckInspection$,
            truckTitles: truckTitles$,
        }).pipe(
            tap((data) => {
                let truckData = data.truckData;
                truckData.registrations = data.truckRegistrations;
                truckData.inspections = data.truckInspection;
                truckData.titles = data.truckTitles;
                this.truckDetailsListStore.add(truckData);
                this.truckDetailsStore.set([truckData]);
            })
        );
    }
}
