import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// Store
import { OwnerInactiveStore } from '@pages/owner/state/owner-inactive-state/owner-inactive.store';

// Services
import { OwnerService } from '@pages/owner/services/owner.service';

// Enums
import { GetOwnerListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class OwnerInactiveResolver {
    constructor(
        private ownerService: OwnerService,
        private ownerStore: OwnerInactiveStore
    ) {}
    resolve(): Observable<GetOwnerListResponse> {
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
