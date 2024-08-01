import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { Observable, of, catchError, tap } from 'rxjs';

// services
import { RoadsideService } from '@pages/safety/violation/services/roadside.service';

// store
import {
    RoadItemState,
    RoadItemStore,
} from '@pages/safety/violation/state/roadside-details-state/roadside-details.store';
import { RoadsideDetailsListStore } from '@pages/safety/violation/state/roadside-details-state/roadside-details-list-state/roadside-details-list.store';

// models
import { RoadsideInspectionResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class RoadsideDetailsResolver  {
    constructor(
        private roadService: RoadsideService,
        private roadDetailsStore: RoadItemStore,
        private rsdls: RoadsideDetailsListStore,
        private router: Router
    ) {}
    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<RoadItemState> | Observable<any> {
        const rs_id = route.paramMap.get('id');
        let id = parseInt(rs_id);
        // if (this.rsdlq.hasEntity(id)) {
        //   return this.rsdlq.selectEntity(id).pipe(
        //     tap((roadResponse: RoadsideInspectionResponse) => {
        //       this.roadDetailsStore.set([roadResponse]);
        //     }),
        //     take(1)
        //   );
        // } else {
        return this.roadService.getRoadsideById(id).pipe(
            catchError(() => {
                this.router.navigate(['/safety/violation']);
                return of('No road data for...' + id);
            }),
            tap((roadResponse: RoadsideInspectionResponse) => {
                this.rsdls.add(roadResponse);
                this.roadDetailsStore.set([roadResponse]);
            })
        );
    }
    // }
}
