import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { MapService } from './../../../../../appcoretruckassist/api/map.service';
import { CreateMapCommand } from './../../../../../appcoretruckassist/model/createMapCommand';
import { MapResponse } from './../../../../../appcoretruckassist/model/mapResponse';
import { tap } from 'rxjs';

declare var google: any;

@Injectable({
    providedIn: 'root',
})
export class MapsService implements OnDestroy {
    private destroy$ = new Subject<void>();

    public mapCircle: any = {
        lat: 41.860119,
        lng: -87.660156,
        radius: 160934.4, // 100 miles
    };

    sortCategory: any = {};
    sortCategoryChange: Subject<any> = new Subject<any>();

    constructor(private mapService: MapService) {
        this.sortCategoryChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((category) => {
                this.sortCategory = category;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getMeters(miles) {
        return miles * 1609.344;
    }

    getMiles(meters) {
        return meters * 0.000621371192;
    }

    getDistanceBetween(lat1, long1, lat2, long2) {
        var from = new google.maps.LatLng(lat1, long1);
        var to = new google.maps.LatLng(lat2, long2);

        var distanceBetween =
            google.maps.geometry.spherical.computeDistanceBetween(from, to);

        if (distanceBetween <= this.mapCircle.radius) {
            return [true, distanceBetween];
        } else {
            return [false, distanceBetween];
        }
    }

    createMap(data: CreateMapCommand) {
        console.log('createMap data', data);
        this.mapService.apiMapPost(data).pipe(
            tap((res: any) => {
                console.log('createMap res', res);
                const subMap = this.getMapById(res.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (map: MapResponse | any) => {
                            // this.shipperStore.add(shipper);
                            // this.shipperMinimalStore.add(shipper);
                            // const brokerShipperCount = JSON.parse(
                            //   localStorage.getItem('brokerShipperTableCount')
                            // );

                            // brokerShipperCount.shipper++;

                            // localStorage.setItem(
                            //   'brokerShipperTableCount',
                            //   JSON.stringify({
                            //     broker: brokerShipperCount.broker,
                            //     shipper: brokerShipperCount.shipper,
                            //   })
                            // );

                            // this.tableService.sendActionAnimation({
                            //   animation: 'add',
                            //   tab: 'shipper',
                            //   data: shipper,
                            //   id: shipper.id,
                            // });

                            console.log('mapResponse', map);

                            subMap.unsubscribe();
                        },
                    });
            })
        );
    }

    getMapById(mapId: number) {
        return this.mapService.apiMapIdGet(mapId);
    }
}
