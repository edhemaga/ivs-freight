import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { RoadsideService } from '@pages/safety/violation/services/roadside.service';

// store
import { RoadsideActiveStore } from '@pages/safety/violation/state/roadside-state/roadside-active/roadside-active.store';

// models
import { RoadsideInspectionListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class RoadsideActiveResolver {
    constructor(
        private roadsideService: RoadsideService,
        private roadsideStore: RoadsideActiveStore
    ) {}
    resolve(): Observable<RoadsideInspectionListResponse> {
        return this.roadsideService.getRoadsideList(true, 1, 1, 25).pipe(
            tap((roadsidePagination) => {
                localStorage.setItem(
                    'roadsideTableCount',
                    JSON.stringify({
                        active: roadsidePagination.active,
                        inactive: roadsidePagination.inactive,
                    })
                );

                this.roadsideStore.set(roadsidePagination.pagination.data);
            })
        );
    }
}
