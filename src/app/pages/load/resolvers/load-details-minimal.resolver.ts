import { Injectable } from '@angular/core';


import { Observable, of, catchError, tap } from 'rxjs';

// services
import { LoadService } from '@shared/services/load.service';

// store
import { LoadMinimalListStore } from '@pages/load/state_old/load-details-state/load-minimal-list-state/load-details-minimal.store';

// models
import { LoadMinimalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class LoadDetailsMinimalResolver
    
{
    private pageIndex: number = 1;
    private pageSize: number = 25;

    constructor(
        private loadService: LoadService,
        private loadMinimalListStore: LoadMinimalListStore
    ) {}
    resolve(): Observable<LoadMinimalListResponse> | Observable<any> {
        return this.loadService
            .getLoadMinimalList(this.pageIndex, this.pageSize)
            .pipe(
                tap((loadListData: LoadMinimalListResponse) => {
                    this.loadMinimalListStore.set(loadListData.pagination.data);
                }),
                catchError(() => {
                    return of('No load data for...');
                })
            );
    }
}
