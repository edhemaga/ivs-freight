import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetOwnerListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OwnerTService } from '../owner.service';
import { OwnerInactiveState, OwnerInactiveStore } from './owner-inactive.store';

@Injectable({
    providedIn: 'root',
})
export class OwnerInactiveResolver implements Resolve<OwnerInactiveState> {
    constructor(
        private ownerService: OwnerTService,
        private ownerStore: OwnerInactiveStore
    ) {}
    resolve(): Observable<OwnerInactiveState | boolean> {
        return this.ownerService
            .getOwner(
                0,
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
                    return of('No owner data...');
                }),
                tap((ownerPagination: GetOwnerListResponse) => {
                    localStorage.setItem(
                        'ownerTableCount',
                        JSON.stringify({
                            active: ownerPagination.activeCount,
                            inactive: ownerPagination.inactiveCount,
                        })
                    );

                    this.ownerStore.set(ownerPagination.pagination.data);
                })
            );
    }
}
