import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil, tap } from 'rxjs';

// Models
import {
    PMTrailerListResponse,
    PMTrailerResponse,
    PMTrailerUnitListResponse,
    PMTruckListResponse,
    PMTruckResponse,
    PMTruckUnitListResponse,
    RepairService,
    UpdatePMTrailerListDefaultCommand,
    UpdatePMTrailerUnitListCommand,
    UpdatePMTruckDefaultListCommand,
    UpdatePMTruckUnitListCommand,
} from 'appcoretruckassist';

// Store
import { PmTruckStore } from '../state/pm-truck-state/pm-truck.store';
import { PmTrailerStore } from '../state/pm-trailer-state/pm-trailer.store';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { PmListTruckStore } from '../state/pm-list-truck-state/pm-list-truck.store';
import { PmListTrailerStore } from '../state/pm-list-trailer-state/pm-list-trailer.store';

@Injectable({
    providedIn: 'root',
})
export class PmService {
    private destroy$ = new Subject<void>();
    private pmListTruck = new BehaviorSubject<PMTruckResponse[]>(null);
    public currentPmListTruck = this.pmListTruck.asObservable();
    private pmListTrailer = new BehaviorSubject<PMTrailerResponse[]>(null);
    public currentPmListTrailer = this.pmListTrailer.asObservable();

    constructor(
        // Services
        private repairService: RepairService,
        private tableService: TruckassistTableService,

        // Store
        private pmTruckStore: PmTruckStore,
        private pmTrailerStore: PmTrailerStore,
        private pmListTruckStore: PmListTruckStore,
        private pmListTrailerStore: PmListTrailerStore
    ) {}

    // ------------------------  Truck --------------------------
    // Get PM Truck List
    public getPMTruckList(): Observable<PMTruckListResponse> {
        return this.repairService.apiRepairPmTruckListGet();
    }

    // Get Pm Truck Unit List
    public getPMTruckUnitList(
        truckId?: number,
        hideInactivePMs?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<PMTruckUnitListResponse> {
        return this.repairService.apiRepairPmTruckUnitListGet(
            truckId,
            hideInactivePMs,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    // Get PM Truck Unit By Id
    public getPmTruckUnitIdModal(id: number): Observable<PMTruckListResponse> {
        return this.repairService.apiRepairPmTruckUnitIdModalGet(id);
    }

    // Update PM Truck List
    public addUpdatePMTruckList(
        data: UpdatePMTruckDefaultListCommand
    ): Observable<object> {
        return this.repairService.apiRepairPmTruckPut(data).pipe(
            tap(() => {
                const subTruckUnitList = this.getPMTruckUnitList()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (pmTruckUnitList) => {
                            this.pmTruckStore.set(
                                pmTruckUnitList.pagination.data
                            );

                            const subPmList = this.getPMTruckList()
                                .pipe(takeUntil(this.destroy$))
                                .subscribe({
                                    next: (pmTruckList) => {
                                        this.pmListTruckStore.set(
                                            pmTruckList.pagination.data
                                        );

                                        this.pmListTruck.next(
                                            pmTruckList.pagination.data
                                        );

                                        subPmList.unsubscribe();
                                    },
                                });

                            subTruckUnitList.unsubscribe();
                        },
                    });
            })
        );
    }

    // Update PM Truck Unit
    public addUpdatePMTruckUnit(
        data: UpdatePMTruckUnitListCommand
    ): Observable<object> {
        return this.repairService.apiRepairPmTruckUnitPut(data).pipe(
            tap(() => {
                const subPm = this.getPMTruckUnitList(data.truckId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (pm) => {
                            this.pmTruckStore.remove(
                                ({ id }) => id === data.pmId
                            );
                            this.pmTruckStore.add(pm.pagination.data[0]);

                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: pm.pagination.data[0],
                                id: pm.pagination.data[0].id,
                            });

                            subPm.unsubscribe();
                        },
                    });
            })
        );
    }

    // Delete PM Truck List
    public deletePMTruckById(id: number): Observable<object> {
        return this.repairService.apiRepairPmTruckIdDelete(id);
    }

    // ------------------------  Trailer --------------------------
    // Get Pm Trailer List
    public getPMTrailerList(
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<PMTrailerListResponse> {
        return this.repairService.apiRepairPmTrailerListGet(
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    // Get Pm Trailer Unit List
    public getPMTrailerUnitList(
        trailerId?: number,
        hideInactivePMs?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<PMTrailerUnitListResponse> {
        return this.repairService.apiRepairPmTrailerUnitListGet(
            trailerId,
            hideInactivePMs,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    // Get PM TRailer Unit By Id
    public getPmTrailerUnitIdModal(
        id: number
    ): Observable<PMTrailerListResponse> {
        return this.repairService.apiRepairPmTrailerUnitIdModalGet(id);
    }

    // Update PM Trailer List
    public addUpdatePMTrailerList(
        data: UpdatePMTrailerListDefaultCommand
    ): Observable<object> {
        return this.repairService.apiRepairPmTrailerPut(data).pipe(
            tap(() => {
                const subTrailerUnitList = this.getPMTrailerUnitList()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (pmTrailerUnitList) => {
                            this.pmTrailerStore.set(
                                pmTrailerUnitList.pagination.data
                            );

                            const subPmList = this.getPMTrailerList()
                                .pipe(takeUntil(this.destroy$))
                                .subscribe({
                                    next: (pmTrailerList) => {
                                        this.pmListTrailerStore.set(
                                            pmTrailerList.pagination.data
                                        );

                                        this.pmListTrailer.next(
                                            pmTrailerList.pagination.data
                                        );

                                        subPmList.unsubscribe();
                                    },
                                });

                            subTrailerUnitList.unsubscribe();
                        },
                    });
            })
        );
    }

    // Update PM Trailer Unit
    public addUpdatePMTrailerUnit(
        data: UpdatePMTrailerUnitListCommand
    ): Observable<object> {
        return this.repairService.apiRepairPmTrailerUnitPut(data).pipe(
            tap(() => {
                const subPm = this.getPMTrailerUnitList(data.trailerId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (pm) => {
                            this.pmTrailerStore.remove(
                                ({ id }) => id === data.trailerId
                            );
                            this.pmTrailerStore.add(pm.pagination.data[0]);

                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: pm.pagination.data[0],
                                id: pm.pagination.data[0].id,
                            });

                            subPm.unsubscribe();
                        },
                    });
            })
        );
    }

    // Delete Pm Trailer List
    public deletePMTrailerById(id: number): Observable<object> {
        return this.repairService.apiRepairPmTrailerIdDelete(id);
    }

    public getRepairList() {
        return this.repairService.apiRepairListGet();
    }

    public getRepairPmTrailerFilter() {
        return this.repairService.apiRepairPmTrailerFilterListGet();
    }

    public getRepairPmTruckFilter() {
        return this.repairService.apiRepairPmTruckFilterListGet();
    }
}
