import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Resolve } from '@angular/router';

//Services
import { RoadsideService } from '../services/roadside.service';

//Models
import { RoadsideInspectionMinimalListResponse } from 'appcoretruckassist';

//State
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
