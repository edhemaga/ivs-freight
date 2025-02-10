import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil, tap } from 'rxjs';

// Models
import {
    PMTrailerDefaultDropdownResponse,
    PMTrailerListResponse,
    PMTrailerResponse,
    PMTrailerUnitListResponse,
    PMTruckDefaultDropdownResponse,
    PMTruckListResponse,
    PMTruckResponse,
    PMTruckUnitListResponse,
    RepairService,
    UpdatePMTrailerListDefaultCommand,
    UpdatePMTrailerUnitListCommand,
    UpdatePMTruckDefaultListCommand,
} from 'appcoretruckassist';
import { PmUpdateTruckUnitListCommand } from '@pages/pm-truck-trailer/models/pm-update-truck-unit-list-command.model';

// Store
import { PmTruckStore } from '@pages/pm-truck-trailer/state/pm-truck-state/pm-truck.store';
import { PmTrailerStore } from '@pages/pm-truck-trailer/state/pm-trailer-state/pm-trailer.store';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { PmListTruckStore } from '@pages/pm-truck-trailer/state/pm-list-truck-state/pm-list-truck.store';
import { PmListTrailerStore } from '@pages/pm-truck-trailer/state/pm-list-trailer-state/pm-list-trailer.store';

// Enums
import { EGeneralActions } from '@shared/enums';

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
        truckTypeId?: number[],
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
            truckTypeId,
            pageIndex,
            pageSize,
            companyId,
            sort,
            null,
            null,
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
                this.getPMTruckUnitList()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (pmTruckUnitList) => {
                            this.pmTruckStore.set(
                                pmTruckUnitList.pagination.data
                            );

                            this.getPMTruckList()
                                .pipe(takeUntil(this.destroy$))
                                .subscribe({
                                    next: (pmTruckList) => {
                                        this.pmListTruckStore.set(
                                            pmTruckList.pagination.data
                                        );

                                        this.pmListTruck.next(
                                            pmTruckList.pagination.data
                                        );
                                    },
                                });
                        },
                    });
            })
        );
    }

    // Update PM Truck Unit
    public addUpdatePMTruckUnit(
        data: PmUpdateTruckUnitListCommand
    ): Observable<object> {
        return this.repairService.apiRepairPmTruckUnitPut(data).pipe(
            tap(() => {
                this.getPMTruckUnitList(data.truckId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (pm) => {
                            this.pmTruckStore.remove(
                                ({ id }) => id === data.pmId
                            );
                            this.pmTruckStore.add(pm.pagination.data[0]);

                            this.tableService.sendActionAnimation({
                                animation: EGeneralActions.UPDATE,
                                data: pm.pagination.data[0],
                                id: pm.pagination.data[0].id,
                            });
                        },
                    });
            })
        );
    }

    // Delete PM Truck List
    public deletePMTruckById(id: number): Observable<object> {
        return this.repairService.apiRepairPmTruckIdDelete(id);
    }

    // Get Truck PM dropdown
    public getPMTruckDropdown(): Observable<PMTruckDefaultDropdownResponse[]> {
        return this.repairService.apiRepairPmTruckDropdownGet();
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
            null,
            null,
            search,
            search1,
            search2
        );
    }

    // Get Pm Trailer Unit List
    public getPMTrailerUnitList(
        trailerId?: number,
        hideInactivePMs?: number,
        trailerTypeId?: number[],
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
            trailerTypeId,
            pageIndex,
            pageSize,
            companyId,
            sort,
            null,
            null,
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
                this.getPMTrailerUnitList()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (pmTrailerUnitList) => {
                            this.pmTrailerStore.set(
                                pmTrailerUnitList.pagination.data
                            );

                            this.getPMTrailerList()
                                .pipe(takeUntil(this.destroy$))
                                .subscribe({
                                    next: (pmTrailerList) => {
                                        this.pmListTrailerStore.set(
                                            pmTrailerList.pagination.data
                                        );

                                        this.pmListTrailer.next(
                                            pmTrailerList.pagination.data
                                        );
                                    },
                                });
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
                this.getPMTrailerUnitList(data.trailerId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (pm) => {
                            this.pmTrailerStore.remove(
                                ({ id }) => id === data.trailerId
                            );
                            this.pmTrailerStore.add(pm.pagination.data[0]);

                            this.tableService.sendActionAnimation({
                                animation: EGeneralActions.UPDATE,
                                data: pm.pagination.data[0],
                                id: pm.pagination.data[0].id,
                            });
                        },
                    });
            })
        );
    }

    // Delete Pm Trailer List
    public deletePMTrailerById(id: number): Observable<object> {
        return this.repairService.apiRepairPmTrailerIdDelete(id);
    }

    public getRepairPmTrailerFilter() {
        return this.repairService.apiRepairPmTrailerFilterListGet();
    }

    public getRepairPmTruckFilter() {
        return this.repairService.apiRepairPmTruckFilterListGet();
    }

    // Get Trailer PM dropdown
    public getPMTrailerDropdown(): Observable<
        PMTrailerDefaultDropdownResponse[]
    > {
        return this.repairService.apiRepairPmTrailerDropdownGet();
    }
}
