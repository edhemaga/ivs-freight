import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, forkJoin, tap } from 'rxjs';

// Services
import { ShipperService } from '@pages/customer/services/shipper.service';

// Store
import { ShipperDetailsStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details.store';
import { ShipperDetailsListStore } from '@pages/customer/state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.store';

// Models
import { ShipperResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class ShipperItemResolver implements Resolve<any[]> {
    constructor(
        private shipperService: ShipperService,
        private shipperDetailsStore: ShipperDetailsStore,
        private sls: ShipperDetailsListStore
    ) {}
    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<ShipperResponse[]> | Observable<any> {
        const shipper_id = route.paramMap.get('id');
        let ids = parseInt(shipper_id);

        const shipperData$ = this.shipperService.getShipperById(ids);

        const shipperLoads$ = this.shipperService.getShipperLoads(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            ids
        );

        return forkJoin({
            shipperData: shipperData$,
            shipperLoads: shipperLoads$,
        }).pipe(
            tap((data) => {
                let shipperData = data.shipperData;
                let loadData = data.shipperLoads?.loads?.data;
                shipperData.loadStops = loadData ? loadData : [];
                this.sls.add(shipperData);
                this.shipperDetailsStore.set([shipperData]);
            })
        );
        /*
        if (this.slq.hasEntity(ids)) {
            return this.slq.selectEntity(ids).pipe(
                tap((shipperResponse: ShipperResponse) => {
                    this.shipperDetailsStore.set([shipperResponse]);
                }),
                take(1)
            );
        } else {
            return this.shipperService.getShipperById(ids).pipe(
                catchError(() => {
                    this.router.navigate(['/customer']);
                    return of('No shipper data for...' + ids);
                }),
                tap((shipperRespon: ShipperResponse) => {
                    this.sls.add(shipperRespon);
                    this.shipperDetailsStore.set([shipperRespon]);
                })
            );
        }
        */
    }
}
