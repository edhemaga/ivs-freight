import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TruckTService } from '../truck.service';
import { TruckItemState, TruckItemStore } from './truck.details.store';
import { TrucksDetailsListQuery } from '../truck-details-list-state/truck-details-list.query';
import { TrucksDetailsListStore } from '../truck-details-list-state/truck-details-list.store';

@Injectable({
    providedIn: 'root',
})
export class TruckItemResolver implements Resolve<TruckItemState> {
    constructor(
        private truckService: TruckTService,
        private truckDetailsStore: TruckItemStore,
        private truckDetailsListQuery: TrucksDetailsListQuery,
        private truckDetailsListStore: TrucksDetailsListStore,
        private router: Router
    ) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<TruckItemState> | Observable<any> {
        const truck_id = route.paramMap.get('id');
        let trid = parseInt(truck_id);


        const truckData$ = this.truckService.getTruckById(
            trid,
        );

        const truckRegistration$ = this.truckService.getTruckRegistrationsById(
            trid,
        );

        const truckInspection$ = this.truckService.getTruckInspectionsById(
            trid,
        );

        const truckTitles$ = this.truckService.getTruckTitlesById(
            trid,
        );
        
         
        return forkJoin({
            truckData: truckData$,
            truckRegistrations: truckRegistration$,
            truckInspection: truckInspection$,
            truckTitles: truckTitles$,
        }).pipe(
            tap((data) => {
                //console.log('---data--', data);
                let truckData = data.truckData;
                truckData.registrations = data.truckRegistrations;
                truckData.inspections = data.truckInspection;
                truckData.titles = data.truckTitles;
                this.truckDetailsListStore.add(truckData);
                this.truckDetailsStore.set([truckData]);
                
            })
        ); 


        /*
        if (this.truckDetailsListQuery.hasEntity(trid)) {
            return this.truckDetailsListQuery.selectEntity(trid).pipe(
                tap((truckResponse: any) => {
                    this.truckDetailsStore.set([truckResponse]);
                }),
                take(1)
            );
        } else {
            return this.truckService.getTruckById(trid).pipe(
                catchError((error) => {
                    this.router.navigate(['/truck']);
                    return of('No truck data for...' + trid);
                }),
                tap((truckResponse: any) => {
                    this.truckDetailsListStore.add(truckResponse);
                    this.truckDetailsStore.set([truckResponse]);
                })
            );
        }

        */
    }
}
