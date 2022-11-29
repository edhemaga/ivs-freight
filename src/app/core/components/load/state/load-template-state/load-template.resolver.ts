import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LoadTemplateListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoadTService } from '../load.service';
import { LoadTemplateState, LoadTemplateStore } from './load-template.store';

@Injectable({
    providedIn: 'root',
})
export class LoadTemplateResolver implements Resolve<LoadTemplateState> {
    constructor(
        private loadService: LoadTService,
        private loadTemplateStore: LoadTemplateStore
    ) {}

    resolve(): Observable<LoadTemplateState | boolean> {
        return this.loadService
            .getLoadTemplateList(undefined, undefined, undefined, 1, 25)
            .pipe(
                catchError(() => {
                    return of('No load template data...');
                }),
                tap((loadPagination: LoadTemplateListResponse) => {
                    localStorage.setItem(
                        'loadTableCount',
                        JSON.stringify({
                            pendingCount: loadPagination.pendingCount,
                            activeCount: loadPagination.activeCount,
                            closedCount: loadPagination.closedCount,
                            templateCount: loadPagination.pagination.count,
                        })
                    );

                    this.loadTemplateStore.set(loadPagination.pagination.data);
                })
            );
    }
}
