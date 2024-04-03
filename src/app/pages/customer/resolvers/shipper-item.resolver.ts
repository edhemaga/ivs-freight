import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

// Services
import { ShipperService } from '../services/shipper.service';

// Store
import { ShipperDetailsStore } from '../state/shipper-state/shipper-details-state/shipper-details.store';
import { ShipperDetailsListStore } from '../state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.store';
import { ShipperDetailsListQuery } from '../state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.query';

// Models
import { ShipperResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class ShipperItemResolver implements Resolve<any[]> {
    constructor(
        // Router
        private router: Router,

        // Services
        private shipperService: ShipperService,

        // Store
        private shipperDetailsStore: ShipperDetailsStore,
        private sls: ShipperDetailsListStore,
        private slq: ShipperDetailsListQuery
    ) {}
    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<ShipperResponse[]> | Observable<any> {
        const shipper_id = route.paramMap.get('id');
        let ids = parseInt(shipper_id);

        const shipperData$ = this.shipperService.getShipperById(ids);

        const shipperLoads$ = this.shipperService.getShipperLoads(ids);

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
