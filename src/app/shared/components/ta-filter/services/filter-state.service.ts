import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { takeUntil, Subject } from 'rxjs';

// store
import { FilterStateStore } from '@shared/components/ta-filter/state/filter-state.store';

// models
import {
    TruckTypeService,
    TrailerTypeService,
    RepairService,
    FuelService,
    StateService,
    DepartmentService,
    LoadService,
    TruckService,
    TrailerService,
} from 'appcoretruckassist';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

@Injectable({ providedIn: 'root' })
export class FilterStateService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        private filterStateStore: FilterStateStore,
        private http: HttpClient,
        private TruckTypeService: TruckTypeService,
        private tableService: TruckassistTableService,
        private TrailerTypeService: TrailerTypeService,
        private repairService: RepairService,
        private fuelService: FuelService,
        private stateService: StateService,
        private departmentService: DepartmentService,
        private loadService: LoadService,
        private truckService: TruckService,
        private trailerService: TrailerService
    ) {}

    // get() {
    //     this.http
    //         .get('https://akita.com')
    //         .subscribe((entities) => this.filterStateStore.set(entities));
    // }

    // add(filterState: FilterState) {
    //     this.filterStateStore.add(filterState);
    // }

    // update(id, filterState: Partial<FilterState>) {
    //     this.filterStateStore.update(id, filterState);
    // }

    // remove(id: ID) {
    //     this.filterStateStore.remove(id);
    // }

    public getTruckType() {
        const truckType = this.TruckTypeService.apiTrucktypeFilterGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.tableService.sendActionAnimation({
                        animation: 'truck-type-update',
                        data: data,
                        id: null,
                    });

                    truckType.unsubscribe();
                },
            });
    }

    public getTrailerType() {
        const trailerType = this.TrailerTypeService.apiTrailertypeFilterGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.tableService.sendActionAnimation({
                        animation: 'trailer-type-update',
                        data: data,
                        id: null,
                    });

                    trailerType.unsubscribe();
                },
            });
    }

    public getRepairCategory() {
        const repairCategory = this.repairService
            .apiRepairCategoryFilterGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.tableService.sendActionAnimation({
                        animation: 'repair-category-update',
                        data: data,
                        id: null,
                    });

                    repairCategory.unsubscribe();
                },
            });
    }

    public getFuelCategory() {
        const fuelCategory = this.fuelService
            .apiFuelCategoryFilterGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.tableService.sendActionAnimation({
                        animation: 'fuel-category-update',
                        data: data,
                        id: null,
                    });
                    fuelCategory.unsubscribe();
                },
            });
    }

    public getStateData() {
        const stateData = this.stateService
            .apiStateFilterGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.tableService.sendActionAnimation({
                        animation: 'state-data-update',
                        data: data,
                        id: null,
                    });
                    stateData.unsubscribe();
                },
            });
    }

    public getDepartmentData() {
        const departmentData = this.departmentService
            .apiDepartmentFilterGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.tableService.sendActionAnimation({
                        animation: 'department-data-update',
                        data: data,
                        id: null,
                    });
                    departmentData.unsubscribe();
                },
            });
    }

    public getDispatchData() {
        const dispatcherData = this.loadService
            .apiLoadDispatcherFilterGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.tableService.sendActionAnimation({
                        animation: 'dispatch-data-update',
                        data: data,
                        id: null,
                    });
                    dispatcherData.unsubscribe();
                },
            });
    }

    public getPmData(mod) {
        if (mod == 'truck') {
            const pmTruckData = this.repairService
                .apiRepairPmTruckFilterListGet()
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (data: any) => {
                        this.tableService.sendActionAnimation({
                            animation: 'pm-truck-data-update',
                            data: data,
                            id: null,
                        });
                        pmTruckData.unsubscribe();
                    },
                });
        } else {
            const pmTrailerkData = this.repairService
                .apiRepairPmTrailerFilterListGet()
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (data: any) => {
                        this.tableService.sendActionAnimation({
                            animation: 'pm-trailer-data-update',
                            data: data,
                            id: null,
                        });
                        pmTrailerkData.unsubscribe();
                    },
                });
        }
    }

    public getTruckData() {
        const truckList = this.truckService
            .apiTruckFilterGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.tableService.sendActionAnimation({
                        animation: 'truck-list-update',
                        data: data,
                        id: null,
                    });
                    truckList.unsubscribe();
                },
            });
    }

    public getTrailerData() {
        const trailerList = this.trailerService
            .apiTrailerFilterGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.tableService.sendActionAnimation({
                        animation: 'trailer-list-update',
                        data: data,
                        id: null,
                    });
                    trailerList.unsubscribe();
                },
            });
    }
    public getRepairTruckData() {
        const truckList = this.repairService
            .apiRepairTruckFilterListGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.tableService.sendActionAnimation({
                        animation: 'truck-list-update',
                        data: data.trucks,
                        id: null,
                    });
                    truckList.unsubscribe();
                },
            });
    }

    public getRepairTrailerData() {
        const trailerList = this.repairService
            .apiRepairTrailerFilterListGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    console.log(data);
                    this.tableService.sendActionAnimation({
                        animation: 'trailer-list-update',
                        data: data.trailers,
                        id: null,
                    });
                    trailerList.unsubscribe();
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
