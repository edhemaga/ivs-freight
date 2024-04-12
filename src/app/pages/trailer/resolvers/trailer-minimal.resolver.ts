import { TrailerService } from '@shared/services/trailer.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of, catchError, tap } from 'rxjs';

// store
import { TrailersMinimalListStore } from '@pages/trailer/state/trailer-minimal-list-state/trailer-minimal.store';

// models
import { TrailerMinimalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class TrailerMinimalResolver
    implements Resolve<TrailerMinimalListResponse>
{
    pageIndex: number = 1;
    pageSize: number = 25;
    count: number;
    constructor(
        private trailerService: TrailerService,
        private trailerMinimalListStore: TrailersMinimalListStore
    ) {}
    resolve(): Observable<TrailerMinimalListResponse> | Observable<any> {
        return this.trailerService
            .getTrailersMinimalList(this.pageIndex, this.pageSize, this.count)
            .pipe(
                catchError(() => {
                    return of('No trailer data for...');
                }),
                tap((trailerMinimal: TrailerMinimalListResponse) => {
                    this.trailerMinimalListStore.set(
                        trailerMinimal.pagination.data
                    );
                })
            );
    }
}
