import { Injectable, OnDestroy } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { TelematicStateStore } from '../state/telematic-state.store';
import { TelematicState } from '../models/telematic-state.model';
import { takeUntil, Subject, Observable, tap, BehaviorSubject, of } from 'rxjs';
import {
    TelematicsService,
    AssignGpsDevicesToCompanyCommand,
    AssignGpsDevicesToTruckCommand,
    AssignGpsDevicesToTrailerCommand,
} from 'appcoretruckassist';
import { GpsServiceService } from 'src/app/core/services/gps/gps-service.service';

@Injectable({ providedIn: 'root' })
export class TelematicStateService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        private telematicStateStore: TelematicStateStore,
        private http: HttpClient,
        private gpsService: GpsServiceService,
        private telematicsService: TelematicsService
    ) {}

    // get() {
    //     this.http
    //         .get('https://akita.com')
    //         .subscribe((entities) => this.telematicStateStore.set(entities));
    // }

    // add(telematicState: TelematicState) {
    //     this.telematicStateStore.add(telematicState);
    // }

    // update(id, telematicState: Partial<TelematicState>) {
    //     this.telematicStateStore.update(id, telematicState);
    // }

    // remove(id: ID) {
    //     this.telematicStateStore.remove(id);
    // }

    startGpsConnection() {
        this.gpsService.startConnection();
    }

    stopGpsConnection() {
        this.gpsService.closeConnection();
    }

    getAllGpsData(request) {
        return this.telematicsService.apiTelematicsDataAllGet();
    }

    getAllUnassignedGpsData(request) {
        // devices not assigned to any company, truck or a trailer
        return this.telematicsService.apiTelematicsUnassignAllGet(request);
    }

    getCompanyUnassignedGpsData(request) {
        // devices assigned to company, but not to a truck or a trailer
        return this.telematicsService.apiTelematicsUnassignCompanyGet(request);
    }

    getUnassignedClusters(
        northEastLatitude?: number,
        northEastLongitude?: number,
        southWestLatitude?: number,
        southWestLongitude?: number,
        zoomLevel?: number,
        addedNew?: boolean,
        pageIndex?: number,
        pageSize?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ) {
        // return this.telematicsService.apiTelematicsClustersGet(
        //     null,
        //     null,
        //     null,
        //     northEastLatitude,
        //     northEastLongitude,
        //     southWestLatitude,
        //     southWestLongitude,
        //     zoomLevel,
        //     addedNew,
        //     pageIndex,
        //     pageSize,
        //     null,
        //     sort,
        //     search,
        //     search1,
        //     search2
        // );
        return of(null);
    }

    getDeviceData(deviceId) {
        // get data by device id
        return this.telematicsService.apiTelematicsDataGet(deviceId);
    }

    getCompanyAssignedData(request) {
        // devices assigned to company, but not to a truck or a trailer
        return this.telematicsService.apiTelematicsUnassignCompanyGet(request);
    }

    getDeviceHistory(deviceId, date?) {
        // get device history
        return this.telematicsService.apiTelematicsHistoryGet(deviceId, date);
    }

    assignDevicesToCompany(devicesArray: AssignGpsDevicesToCompanyCommand) {
        return this.telematicsService
            .apiTelematicsAssignCompanyPost(devicesArray)
            .pipe(
                tap((res: any) => {
                    const subDevice = this.getCompanyAssignedData({})
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (data: any) => {
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

                                // this.sendUpdatedData({
                                //     type: 'route',
                                //     data: route,
                                //     mapId: data.mapId,
                                //     id: route.id,
                                // });

                                subDevice.unsubscribe();
                            },
                        });
                })
            );
    }

    assignDeviceToTruck(data: AssignGpsDevicesToTruckCommand) {
        return this.telematicsService.apiTelematicsAssignTruckPost(data).pipe(
            tap((res: any) => {
                const subDevice = this.getDeviceData(data.deviceId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (data: any) => {
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

                            // this.sendUpdatedData({
                            //     type: 'route',
                            //     data: route,
                            //     mapId: data.mapId,
                            //     id: route.id,
                            // });

                            subDevice.unsubscribe();
                        },
                    });
            })
        );
    }

    assignDeviceToTrailer(data: AssignGpsDevicesToTrailerCommand) {
        return this.telematicsService.apiTelematicsAssignTrailerPost(data).pipe(
            tap((res: any) => {
                const subDevice = this.getDeviceData(data.deviceId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (data: any) => {
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

                            // this.sendUpdatedData({
                            //     type: 'route',
                            //     data: route,
                            //     mapId: data.mapId,
                            //     id: route.id,
                            // });

                            subDevice.unsubscribe();
                        },
                    });
            })
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
