import { Injectable, OnDestroy } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { RoutingStateStore } from './routing-state.store';
import { RoutingState } from './routing-state.model';
import {
  UpdateMapCommand,
  MapService,
  RouteService,
  StopService,
  CreateRouteCommand,
  CreateResponse,
  RouteResponse,
  UpdateRouteCommand
} from 'appcoretruckassist';
import { takeUntil, Subject, Observable, tap } from 'rxjs';
import { MapResponse } from '../../../../../../../appcoretruckassist/model/mapResponse';

@Injectable({ providedIn: 'root' })
export class RoutingStateService implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private routingStateStore: RoutingStateStore,
    private http: HttpClient,
    private mapService: MapService,
    private routeService: RouteService,
    private stopService: StopService
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

              console.log('updateMap response', map);

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

              console.log('addRoute', route);

              subRoute.unsubscribe();
            },
          });
      })
    );
  }

  updateRoute(data: UpdateRouteCommand): Observable<any> {
    return this.routeService.apiRoutePut(data).pipe(
      tap(() => {
        const subMap = this.getRouteById(data.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (route: RouteResponse | any) => {
              // this.trailerActiveStore.remove(({ id }) => id === data.id);

              // this.trailerActiveStore.add(trailer);
              // this.tadl.replace(trailer.id, trailer);
              // this.tableService.sendActionAnimation({
              //   animation: 'update',
              //   data: trailer,
              //   id: trailer.id,
              // });

              console.log('updateRoute response', route);

              subMap.unsubscribe();
            },
          });
      })
    );
  }

  deleteRouteById(routeId: number): Observable<any> {
    return this.routeService.apiRouteIdDelete(routeId).pipe(
      tap(() => {
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

        console.log('deleteRouteById', routeId);
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
