import { Injectable } from '@angular/core';

import { forkJoin, Observable, tap } from 'rxjs';

// Services
import { PmService } from '@pages/pm-truck-trailer/services/pm.service';

// Store
import { PmTrailerStore } from '@pages/pm-truck-trailer/state/pm-trailer-state/pm-trailer.store';
import { PmListTrailerStore } from '@pages/pm-truck-trailer/state/pm-list-trailer-state/pm-list-trailer.store';

// Models
import {
    PMTrailerListResponse,
    PMTrailerUnitListResponse,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class PmTrailerResolver {
    constructor(
        // Store
        private pmTrailerStore: PmTrailerStore,
        private pmListTrailerStore: PmListTrailerStore,

        // Services
        private pmService: PmService
    ) {}
    resolve(): Observable<[PMTrailerUnitListResponse, PMTrailerListResponse]> {
        return forkJoin([
            this.pmService.getPMTrailerUnitList(undefined, undefined, 1),
            this.pmService.getPMTrailerList(),
        ]).pipe(
            tap(([pmTrailerPagination, trailerPmList]) => {
                localStorage.setItem(
                    'pmTrailerTableCount',
                    JSON.stringify({
                        pmTrailer: pmTrailerPagination.pmTrailerCount,
                    })
                );

                this.pmListTrailerStore.set(trailerPmList.pagination.data);

                this.pmTrailerStore.set(pmTrailerPagination.pagination.data);
            })
        );
    }
}
