import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of, catchError, tap, take } from 'rxjs';

// models
import { LoadResponse } from 'appcoretruckassist';

// services
import { LoadService } from '@shared/services/load.service';

// store
import { LoadDetailsListQuery } from '@pages/load/state/load-details-state/load-details-list-state/load-details-list.query';
import { LoadDetailsListStore } from '@pages/load/state/load-details-state/load-details-list-state/load-details-list.store';
import { LoadItemStore } from '@pages/load/state/load-details-state/load-details.store';

@Injectable({
    providedIn: 'root',
})
export class LoadDetailsResolver implements Resolve<LoadResponse[]> {
    constructor(
        private router: Router,

        // store
        private loadService: LoadService,
        private loadItemStore: LoadItemStore,
        private ldlStore: LoadDetailsListStore,
        private ldlQuery: LoadDetailsListQuery
    ) {}
    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<LoadResponse[]> | Observable<any> {
        const loadId = route.paramMap.get('id');

        const id = parseInt(loadId);

        if (this.ldlQuery.hasEntity(id)) {
            return this.ldlQuery.selectEntity(id).pipe(
                tap((loadResponse: LoadResponse) => {
                    this.loadItemStore.set([loadResponse]);
                }),
                take(1)
            );
        } else {
            return this.loadService.getLoadById(id).pipe(
                tap((loadResponse: LoadResponse) => {
                    this.ldlStore.add(loadResponse);
                    this.loadItemStore.set([loadResponse]);
                }),
                catchError(() => {
                    this.router.navigate(['/load']);

                    return of('No Load data for...' + id);
                })
            );
        }
    }
}
