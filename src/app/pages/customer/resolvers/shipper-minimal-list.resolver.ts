import { Injectable } from '@angular/core';

import { Observable, of, catchError, tap } from 'rxjs';
import {} from 'rxjs/operators';

// Services
import { ShipperService } from '@pages/customer/services/shipper.service';

// Store
import { ShipperMinimalListStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal-list.store';

// Models
import { ShipperMinimalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class ShipperMinimalListResolver
    
{
    pageIndex: number = 1;
    pageSize: number = 25;
    count: number;

    constructor(
        private shipperService: ShipperService,
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
