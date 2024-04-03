import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Services
import { ShipperService } from '../services/shipper.service';

// Store
import { ShipperMinimalListStore } from '../state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal-list.store';

// Models
import { ShipperMinimalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class ShipperMinimalListResolver
    implements Resolve<ShipperMinimalListResponse>
{
    pageIndex: number = 1;
    pageSize: number = 25;
    count: number;

    constructor(
        // Services
        private shipperService: ShipperService,

        // Store
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
