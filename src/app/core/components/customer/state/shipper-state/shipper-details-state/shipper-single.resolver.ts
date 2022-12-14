import { ShipperItemStore } from './shipper-details.store';
import { ShipperResponse } from './../../../../../../../../appcoretruckassist/model/shipperResponse';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { ShipperTService } from '../shipper.service';
import { ShipperDetailsListQuery } from './shipper-details-list-state/shipper-details-list.query';
import { ShipperDetailsListStore } from './shipper-details-list-state/shipper-details-list.store';

@Injectable({
    providedIn: 'root',
})
export class ShipperSingleResolver implements Resolve<any[]> {
    constructor(
        private shipperService: ShipperTService,
        private shipperDetailsStore: ShipperItemStore,
        private router: Router,
        private sls: ShipperDetailsListStore,
        private slq: ShipperDetailsListQuery
    ) {}
    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<ShipperResponse[]> | Observable<any> {
        const shipper_id = route.paramMap.get('id');
        let ids = parseInt(shipper_id);
        
        const shipperData$ = this.shipperService.getShipperById(
            ids,
        );
        
        const shipperLoads$ = this.shipperService.getShipperLoads(ids);
        
        return forkJoin({
            shipperData: shipperData$,
            shipperLoads: shipperLoads$,
        }).pipe(
            tap((data) => {
                let shipperData = data.shipperData;
                let loadData = data.shipperLoads.data;
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
