
import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, tap, forkJoin } from 'rxjs';
import { TrailerTService } from '../trailer.service';

import { TrailerItemState, TrailerItemStore } from './trailer-details.store';
import { TrailersDetailsListQuery } from '../trailer-details-list-state/trailer-details-list.query';
import { TrailerDetailsListStore } from '../trailer-details-list-state/trailer-details-list.store';

@Injectable({
    providedIn: 'root',
})
export class TrailerItemResolver implements Resolve<TrailerItemState> {
    constructor(
        private trailerService: TrailerTService,
        private trailerDetailStore: TrailerItemStore,
        private trailerDetailListQuery: TrailersDetailsListQuery,
        private trailerDetailListStore: TrailerDetailsListStore,
        private router: Router
    ) {}
    
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<TrailerItemState> | Observable<any> {
        const trailer_id = route.paramMap.get('id');
        let trid = parseInt(trailer_id);


        const trailerData$ = this.trailerService.getTrailerById(
            trid,
        );

        const trailerRegistration$ = this.trailerService.getTrailerRegistrationsById(
            trid,
        );

        const trailerInspection$ = this.trailerService.getTrailerInspectionsById(
            trid,
        );

        const trailerTitles$ = this.trailerService.getTrailerTitlesById(
            trid,
        );
        

        return forkJoin({
                trailerData: trailerData$,
                trailerRegistrations: trailerRegistration$,
                trailerInspection: trailerInspection$,
                trailerTitles: trailerTitles$,
            }).pipe(
                tap((data) => {
                    //console.log('---data--', data);
                    let trailerData = data.trailerData;
                    trailerData.registrations = data.trailerRegistrations;
                    trailerData.inspections = data.trailerInspection;
                    trailerData.titles = data.trailerTitles;
                    this.trailerDetailListStore.add(trailerData);
                    this.trailerDetailStore.set([trailerData]);
                    
                })
            );        

        /*

        if (this.trailerDetailListQuery.hasEntity(trid)) {
            console.log("-iffff--")
            return this.trailerDetailListQuery.selectEntity(trid).pipe(
                tap((trailerResponse: any) => {
                    console.log('trailerResponse---', trailerResponse);
                    this.trailerDetailListStore.add(trailerResponse);
                    this.trailerDetailStore.set([trailerResponse]);
                }),
                take(1)
            );
        } else {
            
            return this.trailerService.getTrailerById(trid).pipe(
                catchError((error) => {
                    this.router.navigate(['/trailer']);
                    console.log('--here-----')
                    return of('No trailer data for...' + trailer_id);
                }),
                tap((trailerReponse: any) => {
                    console.log('--here-----')
                    this.trailerDetailListStore.add(trailerReponse);
                    this.trailerDetailStore.set([trailerReponse]);
                })
            );

           
        }
         */
    }
}
