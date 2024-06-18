import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// models
import { LoadListResponse } from 'appcoretruckassist';

// services
import { LoadService } from '@shared/services/load.service';

// store
import {
    LoadPandingState,
    LoadPendingStore,
} from '@pages/load/state/load-pending-state/load-pending.store';

@Injectable({
    providedIn: 'root',
})
export class LoadPendingResolver implements Resolve<LoadPandingState> {
    constructor(
        private loadService: LoadService,
        private loadPandingStore: LoadPendingStore
    ) {}

    resolve(): Observable<LoadPandingState | boolean> {
        return this.loadService
            .getLoadList(
                null,
                1,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                1,
                25,
                null,
                null,
                null,
                null,
                null
            )
            .pipe(
                catchError(() => {
                    return of('No load panding data...');
                }),
                tap((loadPagination: LoadListResponse) => {
                    localStorage.setItem(
                        'loadTableCount',
                        JSON.stringify({
                            pendingCount: loadPagination.pendingCount,
                            activeCount: loadPagination.activeCount,
                            closedCount: loadPagination.closedCount,
                            templateCount: loadPagination.templateCount,
                        })
                    );

                    this.loadPandingStore.set(loadPagination.pagination.data);
                })
            );
    }
}
