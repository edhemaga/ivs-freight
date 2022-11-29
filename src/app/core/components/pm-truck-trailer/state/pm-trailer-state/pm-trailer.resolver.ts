import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PMTrailerUnitListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PmTService } from '../pm.service';
import { PmTrailerState, PmTrailerStore } from './pm-trailer.store';

@Injectable({
    providedIn: 'root',
})
export class pmTrailerResolver implements Resolve<PmTrailerState> {
    constructor(
        private pmService: PmTService,
        private pmTrailerStore: PmTrailerStore
    ) {}
    resolve(): Observable<PmTrailerState | boolean> {
        return this.pmService
            .getPMTrailerUnitList(undefined, undefined, 1, 25)
            .pipe(
                catchError(() => {
                    return of('No pm trailers data...');
                }),
                tap((pmTrailerPagination: PMTrailerUnitListResponse) => {
                    localStorage.setItem(
                        'pmTrailerTableCount',
                        JSON.stringify({
                            pmTrailer: pmTrailerPagination.pmTrailerCount,
                        })
                    );

                    this.pmTrailerStore.set(
                        pmTrailerPagination.pagination.data
                    );
                })
            );
    }
}
