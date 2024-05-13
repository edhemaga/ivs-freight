import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, tap, forkJoin } from 'rxjs';

// Services
import { TrailerService } from '@shared/services/trailer.service';

// State
import {
    TrailerItemState,
    TrailerItemStore,
} from '@pages/trailer/state/trailer-details-state/trailer-details.store';
import { TrailerDetailsListStore } from '@pages/trailer/state/trailer-details-list-state/trailer-details-list.store';

@Injectable({
    providedIn: 'root',
})
export class TrailerItemsResolver implements Resolve<TrailerItemState> {
    constructor(
        private trailerService: TrailerService,
        private trailerDetailStore: TrailerItemStore,

        private trailerDetailListStore: TrailerDetailsListStore
    ) {}

    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<TrailerItemState> | Observable<any> {
        const trailer_id = route.paramMap.get('id');
        let trid = parseInt(trailer_id);

        const trailerData$ = this.trailerService.getTrailerById(trid);

        const trailerRegistration$ =
            this.trailerService.getTrailerRegistrationsById(trid);

        const trailerInspection$ =
            this.trailerService.getTrailerInspectionsById(trid);

        const trailerTitles$ = this.trailerService.getTrailerTitlesById(trid);

        return forkJoin({
            trailerData: trailerData$,
            trailerRegistrations: trailerRegistration$,
            trailerInspection: trailerInspection$,
            trailerTitles: trailerTitles$,
        }).pipe(
            tap((data) => {
                let trailerData = data.trailerData;
                trailerData.registrations = data.trailerRegistrations;
                trailerData.inspections = data.trailerInspection;
                trailerData.titles = data.trailerTitles;
                this.trailerDetailListStore.add(trailerData);
                this.trailerDetailStore.set([trailerData]);
            })
        );
    }
}
