import { Injectable } from '@angular/core';

import { Observable, of, catchError, tap } from 'rxjs';
import {} from 'rxjs/operators';

// services
import { ShipperService } from '@pages/customer/services';

// store
import { ShipperMinimalListStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal-list.store';

// models
import { ShipperMinimalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class ShipperMinimalListResolver {
    private pageIndex: number = 1;
    private pageSize: number = 25;
    private count: number;

    constructor(
        private shipperService: ShipperService,

        // store
        private shipperMinimalListStore: ShipperMinimalListStore
    ) {}

    resolve(): Observable<ShipperMinimalListResponse> | Observable<any> {
        return this.shipperService
            .getShipperMinimalList(this.pageIndex, this.pageSize, this.count)
            .pipe(
                catchError(() => {
                    return of('No shipper data for...');
                }),
                tap((shipperMinimal: ShipperMinimalListResponse) => {
                    this.shipperMinimalListStore.set(
                        shipperMinimal.pagination.data
                    );
                })
            );
    }
}
