import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of, catchError, tap } from 'rxjs';

// services
import { LoadService } from '@shared/services/load.service';

// store
import { LoadMinimalListStore } from '@pages/load/state/load-details-state/load-minimal-list-state/load-details-minimal.store';

// models
import { LoadMinimalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class LoadDetailsMinimalResolver
    implements Resolve<LoadMinimalListResponse>
{
    pageIndex: number = 1;
    pageSize: number = 25;
    constructor(
        private loadService: LoadService,
        private loadMinimalListStore: LoadMinimalListStore
    ) {}
    resolve(): Observable<LoadMinimalListResponse> | Observable<any> {
        return this.loadService
            .getLoadMinimalList(this.pageIndex, this.pageSize)
            .pipe(
                catchError(() => {
                    return of('No load data for...');
                }),
                tap((loadListData: LoadMinimalListResponse) => {
                    this.loadMinimalListStore.set(loadListData.pagination.data);
                })
            );
    }
}
