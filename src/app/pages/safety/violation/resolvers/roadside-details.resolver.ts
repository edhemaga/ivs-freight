import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

//Services
import { RoadsideService } from '../services/roadside.service';

//Models
import { RoadsideInspectionResponse } from 'appcoretruckassist';

//States
import {
    RoadItemState,
    RoadItemStore,
} from '../state/roadside-details-state/roadside-details.store';
import { RoadsideDetailsListStore } from '../state/roadside-details-state/roadside-details-list-state/roadside-details-list.store';

@Injectable({
    providedIn: 'root',
})
export class RoadItemResolver implements Resolve<RoadItemState> {
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
