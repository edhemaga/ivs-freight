import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LoadListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoadTService } from '../load.service';
import { LoadClosedState, LoadClosedStore } from './load-closed.store';

@Injectable({
    providedIn: 'root',
})
export class LoadClosedResolver implements Resolve<LoadClosedState> {
    constructor(
        private loadService: LoadTService,
        private loadClosedStore: LoadClosedStore
    ) {}

    resolve(): Observable<LoadClosedState | boolean> {
        return this.loadService
            .getLoadList(
                undefined,
                3,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                1,
                25
            )
            .pipe(
                catchError(() => {
                    return of('No load closed data...');
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

                    this.loadClosedStore.set(loadPagination.pagination.data);
                })
            );
    }
}
