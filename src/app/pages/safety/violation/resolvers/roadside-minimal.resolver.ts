import { RoadsideInspectionMinimalListResponse } from 'appcoretruckassist';
import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RoadsideService } from '../services/roadside.service';
import {
    RoadsideMinimalListState,
    RoadsideMinimalListStore,
} from '../state/roadside-details-state/roadside-minimal-list-state/roadside-minimal.store';

@Injectable({
    providedIn: 'root',
})
export class RoadsideMinimalResolver
    implements Resolve<RoadsideMinimalListState>
{
    pageIndex: number = 1;
    pageSize: number = 25;
    constructor(
        private rsService: RoadsideService,
        private rsMinimalListStore: RoadsideMinimalListStore
    ) {}
    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<RoadsideMinimalListState> | Observable<any> {
        return this.rsService
            .getRoadsideMinimalList(this.pageIndex, this.pageSize)
            .pipe(
                catchError((error) => {
                    return of('No drivers data for...');
                }),
                tap((rsMinimalList: RoadsideInspectionMinimalListResponse) => {
                    this.rsMinimalListStore.set(rsMinimalList.pagination.data);
                })
            );
    }
}
