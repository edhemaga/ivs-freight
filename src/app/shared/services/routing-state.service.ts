import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { takeUntil, Subject, Observable, tap, BehaviorSubject } from 'rxjs';

// store
import { RoutingStateStore } from '@pages/routing/state/routing-state/routing-state.store';

// services
import { NotificationService } from '@shared/services/notification.service';

// models
import {
    UpdateMapCommand,
    MapService,
    RouteService,
    StopService,
    RoutingService,
    CreateRouteCommand,
    CreateResponse,
    RouteResponse,
    UpdateRouteCommand,
    MapResponse,
} from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class RoutingStateService implements OnDestroy {
    private destroy$ = new Subject<void>();

    private updatedData = new BehaviorSubject<any>({});
    public currentUpdatedData = this.updatedData.asObservable();

    constructor(
        private routingStateStore: RoutingStateStore,
        private http: HttpClient,
        private mapService: MapService,
        private routeService: RouteService,
        private stopService: StopService,
        private routingService: RoutingService,
        private notificationService: NotificationService
    ) {}

    // get() {
    //   this.http
    //     .get('https://akita.com')
    //     .subscribe((entities) => this.routingStateStore.set(entities));
    // }

    // add(routingState: RoutingState) {
    //   this.routingStateStore.add(routingState);
    // }

    // update(id, routingState: Partial<RoutingState>) {
    //   this.routingStateStore.update(id, routingState);
    // }

    // remove(id: ID) {
    //   this.routingStateStore.remove(id);
    // }

    getMapById(mapId: number) {
        return this.mapService.apiMapIdGet(mapId);
    }

    getMapList(
        companyUserId?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ) {
        return this.mapService.apiMapListGet(
            companyUserId,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    updateMap(data: UpdateMapCommand): Observable<any> {
        return this.mapService.apiMapPut(data).pipe(
            tap(() => {
                const subMap = this.getMapById(data.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (map: MapResponse | any) => {
                            // this.trailerActiveStore.remove(({ id }) => id === data.id);

                            // this.trailerActiveStore.add(trailer);
                            // this.tadl.replace(trailer.id, trailer);
                            // this.tableService.sendActionAnimation({
                            //   animation: 'update',
                            //   data: trailer,
                            //   id: trailer.id,
                            // });

                            this.sendUpdatedData({
                                type: 'map',
                                data: map,
                                id: data.id,
                            });

                            subMap.unsubscribe();
                        },
                    });
            })
        );
    }

    getRouteList(
        mapId?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ) {
        return this.routeService.apiRouteListGet(
            mapId,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    getRouteById(routeId: number) {
        return this.routeService.apiRouteIdGet(routeId);
    }

    addRoute(data: CreateRouteCommand): Observable<CreateResponse> {
        return this.routeService.apiRoutePost(data).pipe(
            tap((res: any) => {
                const subRoute = this.getRouteById(res.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (route: RouteResponse | any) => {
                            this.routingStateStore.add(route);
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

                            this.sendUpdatedData({
                                type: 'route',
                                data: route,
                                mapId: data.mapId,
                                id: route.id,
                            });

                            subRoute.unsubscribe();
                        },
                    });
            })
        );
    }

    updateRoute(data: UpdateRouteCommand | any): Observable<any> {
        return this.routeService.apiRoutePut(data).pipe(
            tap(() => {
                const subMap = this.getRouteById(data.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (updatedRoute: RouteResponse | any) => {
                            const route = { ...updatedRoute };
                            const storeRoutes: any =
                                this.routingStateStore.getValue().entities;

                            var mapId;
                            Object.keys(storeRoutes).forEach((key: any) => {
                                if (
                                    storeRoutes[key].id == route.id &&
                                    storeRoutes[key].type == 'route'
                                ) {
                                    mapId = storeRoutes[key].mapId;
                                }
                            });

                            route.stops = [...route.stops];

                            route.stops.map((stop) => {
                                stop.cityAddress =
                                    stop.address.city +
                                    ', ' +
                                    stop.address.stateShortName +
                                    ' ' +
                                    (stop.address.zipCode
                                        ? stop.address.zipCode
                                        : '');

                                stop.lat = stop.latitude;
                                stop.long = stop.longitude;
                            });

                            const routeData = {
                                ...route,
                                type: 'route',
                                mapId: mapId,
                                fakeId: parseInt([2, route.id].join('')),
                            };
                            this.routingStateStore.update(
                                routeData.fakeId,
                                routeData
                            );

                            // this.trailerActiveStore.remove(({ id }) => id === data.id);

                            // this.trailerActiveStore.add(trailer);
                            // this.tadl.replace(trailer.id, trailer);
                            // this.tableService.sendActionAnimation({
                            //   animation: 'update',
                            //   data: trailer,
                            //   id: trailer.id,
                            // });

                            this.sendUpdatedData({
                                type: 'edit-route',
                                data: routeData,
                                id: route.id,
                            });

                            subMap.unsubscribe();
                        },
                    });
            })
        );
    }

    deleteRouteById(routeId: number): Observable<any> {
        return this.routeService.apiRouteIdDelete(routeId).pipe(
            tap(() => {
                this.routingStateStore.remove(({ id }) => id === routeId);
                // this.shipperStore.remove(({ id }) => id === shipperId);
                // this.shipperMinimalStore.remove(({ id }) => id === shipperId);
                // this.sListStore.remove(({ id }) => id === shipperId);
                // const brokerShipperCount = JSON.parse(
                //   localStorage.getItem('brokerShipperTableCount')
                // );

                // brokerShipperCount.shipper--;

                // localStorage.setItem(
                //   'brokerShipperTableCount',
                //   JSON.stringify({
                //     broker: brokerShipperCount.broker,
                //     shipper: brokerShipperCount.shipper,
                //   })
                // );

                this.sendUpdatedData({
                    type: 'delete-route',
                    id: routeId,
                });
            })
        );
    }

    deleteStopById(stopId: number, routeId: number): Observable<any> {
        return this.stopService.apiStopIdDelete(stopId).pipe(
            tap(() => {
                this.sendUpdatedData({
                    type: 'delete-stop',
                    id: stopId,
                    routeId: routeId,
                });
            })
        );
    }

    getRouteShape(
        locations?: string,
        truckId?: number,
        trailerId?: number,
        height?: number,
        loadWeight?: number,
        hazMat?: boolean
    ) {
        return this.routingService
            .apiRoutingGet(
                locations,
                truckId,
                trailerId,
                height,
                loadWeight,
                hazMat
            )
            .pipe(tap(() => {}));
    }

    decodeRouteShape(routeId: any) {
        return this.routingService
            .apiRoutingDecodeGet(routeId)
            .pipe(tap(() => {}));
    }

    public sendUpdatedData(data: any) {
        this.updatedData.next(data);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
