import { RoadsideInspectionMinimalListResponse } from './../../../../../../../../../appcoretruckassist/model/roadsideInspectionMinimalListResponse';
import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import {
    DriverMinimalListResponse,
    DriverMinimalResponsePagination,
} from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { RoadsideService } from '../../roadside.service';
import {
    RoadsideMinimalListState,
    RoadsideMinimalListStore,
} from './roadside-minimal.store';

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
