import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ShipperListResponse } from 'appcoretruckassist';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ShipperTService } from './shipper.service';
import { ShipperState, ShipperStore } from './shipper.store';

@Injectable({
    providedIn: 'root',
})
export class ShipperResolver implements Resolve<ShipperState> {
    constructor(
        private shipperService: ShipperTService,
        private shipperStore: ShipperStore
    ) {}
    resolve(): Observable<ShipperState | boolean> {
        return this.shipperService.getShippersList(null, null, 1, 25).pipe(
            catchError(() => {
                return of('No shipper data...');
            }),
            tap((shipperPagination: ShipperListResponse) => {
                this.shipperStore.set(shipperPagination.pagination.data);
            })
        );
    }
}
