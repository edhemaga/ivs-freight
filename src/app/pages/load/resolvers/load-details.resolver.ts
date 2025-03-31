import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, catchError, tap } from 'rxjs';

// models
import { LoadResponse } from 'appcoretruckassist';

// services
import { LoadService } from '@shared/services/load.service';

// store
import { LoadDetailsListStore } from '@pages/load/state_old/load-details-state/load-details-list-state/load-details-list.store';
import { LoadItemStore } from '@pages/load/state_old/load-details-state/load-details.store';

@Injectable({
    providedIn: 'root',
})
export class LoadDetailsResolver  {
    constructor(
        private router: Router,

        // store
        private loadService: LoadService,
        private loadItemStore: LoadItemStore,
        private loadDetailsListStore: LoadDetailsListStore
    ) {}
    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<LoadResponse[]> | Observable<any> {
        const loadId = route.paramMap.get('id');

        const id = parseInt(loadId);

        return this.loadService.getLoadById(id).pipe(
            tap((loadResponse: LoadResponse) => {
                this.loadDetailsListStore.add(loadResponse);
                this.loadItemStore.set([loadResponse]);
            }),
            catchError(() => {
                this.router.navigate(['/load']);

                return of('No Load data for...' + id);
            })
        );
    }
}
