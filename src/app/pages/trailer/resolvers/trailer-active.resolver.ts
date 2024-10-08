import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { TrailerService } from '@shared/services/trailer.service';

// store
import { TrailerActiveStore } from '@pages/trailer/state/trailer-active-state/trailer-active.store';

// models
import { TrailerListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class TrailerActiveResolver {
    constructor(
        private trailerService: TrailerService,
        private trailerStore: TrailerActiveStore
    ) {}
    resolve(): Observable<TrailerListResponse> {
        return this.trailerService.getTrailers(1, null, 1, 25).pipe(
            tap((trailerPagination) => {
                localStorage.setItem(
                    'trailerTableCount',
                    JSON.stringify({
                        active: trailerPagination.activeCount,
                        inactive: trailerPagination.inactiveCount,
                    })
                );

                this.trailerStore.set(trailerPagination.pagination.data);
            })
        );
    }
}
