import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';

// Services
import { ShipperTService } from '../services/shipper.service';

// Store
import { ShipperItemStore } from '../state/shipper-state/shipper-details-state/shipper-details.store';
import { ShipperDetailsListStore } from '../state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.store';
import { ShipperDetailsListQuery } from '../state/shipper-state/shipper-details-state/shipper-details-list-state/shipper-details-list.query';

// Models
import { ShipperResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class ShipperSingleResolver implements Resolve<any[]> {
    constructor(
        // Router
        private router: Router,
        
        // Services
        private shipperService: ShipperTService,

        // Store
        private shipperDetailsStore: ShipperItemStore,
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
