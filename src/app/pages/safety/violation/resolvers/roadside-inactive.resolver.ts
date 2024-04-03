import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of, catchError, tap } from 'rxjs';

// services
import { RoadsideService } from '../services/roadside.service';

// store
import {
    RoadsideInactiveState,
    RoadsideInactiveStore,
} from '../state/roadside-state/roadside-inactive/roadside-inactive.store';

// models
import { RoadsideInspectionListResponse } from 'appcoretruckassist';
@Injectable({
    providedIn: 'root',
})
export class RoadsideInactiveResolver
    implements Resolve<RoadsideInactiveState>
{
    constructor(
        private roadsideService: RoadsideService,
        private roadsideStore: RoadsideInactiveStore
    ) {}
    resolve(): Observable<RoadsideInactiveState | boolean> {
        return this.roadsideService.getRoadsideList(false, 1, 1, 25).pipe(
            catchError(() => {
                return of('No roadside inactive data...');
            }),
            tap((roadsidePagination: RoadsideInspectionListResponse) => {
                this.roadsideStore.set(roadsidePagination.pagination.data);
            })
        );
    }
}
