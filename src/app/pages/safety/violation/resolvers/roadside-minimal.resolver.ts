import { Injectable } from '@angular/core';


import { Observable, of, catchError, tap } from 'rxjs';

// services
import { RoadsideService } from '@pages/safety/violation/services/roadside.service';

// models
import { RoadsideInspectionMinimalListResponse } from 'appcoretruckassist';

// state
import {
    RoadsideMinimalListState,
    RoadsideMinimalListStore,
} from '@pages/safety/violation/state/roadside-details-state/roadside-minimal-list-state/roadside-minimal.store';

@Injectable({
    providedIn: 'root',
})
export class RoadsideMinimalResolver
    
{
    pageIndex: number = 1;
    pageSize: number = 25;
    constructor(
        private rsService: RoadsideService,
        private rsMinimalListStore: RoadsideMinimalListStore
    ) {}
    resolve(): Observable<RoadsideMinimalListState> | Observable<any> {
        return this.rsService
            .getRoadsideMinimalList(this.pageIndex, this.pageSize)
            .pipe(
                catchError(() => {
                    return of('No drivers data for...');
                }),
                tap((rsMinimalList: RoadsideInspectionMinimalListResponse) => {
                    this.rsMinimalListStore.set(rsMinimalList.pagination.data);
                })
            );
    }
}
