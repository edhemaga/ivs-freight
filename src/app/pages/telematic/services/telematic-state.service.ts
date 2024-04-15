import { Injectable, OnDestroy } from '@angular/core';
import { takeUntil, Subject, tap, of } from 'rxjs';

// Services
import { GpsService } from '@pages/telematic/services/gps-service.service';

// Models
import {
    TelematicsService,
    AssignGpsDevicesToCompanyCommand,
    AssignGpsDevicesToTruckCommand,
    AssignGpsDevicesToTrailerCommand,
} from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class TelematicStateService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        // Services
        private gpsService: GpsService,
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

    getAllGpsData() {
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

    getUnassignedClusters() {
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
                tap(() => {
                    const subDevice = this.getCompanyAssignedData({})
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: () => {
                                subDevice.unsubscribe();
                            },
                        });
                })
            );
    }

    assignDeviceToTruck(data: AssignGpsDevicesToTruckCommand) {
        return this.telematicsService.apiTelematicsAssignTruckPost(data).pipe(
            tap(() => {
                const subDevice = this.getDeviceData(data.deviceId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            subDevice.unsubscribe();
                        },
                    });
            })
        );
    }

    assignDeviceToTrailer(data: AssignGpsDevicesToTrailerCommand) {
        return this.telematicsService.apiTelematicsAssignTrailerPost(data).pipe(
            tap(() => {
                const subDevice = this.getDeviceData(data.deviceId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
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
