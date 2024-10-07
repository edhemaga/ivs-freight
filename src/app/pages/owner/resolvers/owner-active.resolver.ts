import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { OwnerService } from '@pages/owner/services/owner.service';

// store
import { OwnerActiveStore } from '@pages/owner/state/owner-active-state/owner-active.store';
import { GetOwnerListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class OwnerActiveResolver {
    constructor(
        private ownerService: OwnerService,
        private ownerStore: OwnerActiveStore
    ) {}
    resolve(): Observable<GetOwnerListResponse> {
        return this.ownerService
            .getOwner(
                1,
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
                tap((ownerPagination) => {
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
