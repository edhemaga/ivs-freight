import { Injectable } from '@angular/core';
import {
    CreateResponse,
    GetOwnerListResponse,
    OwnerModalResponse,
    OwnerResponse,
    OwnerService
} from 'appcoretruckassist';
import { Observable, tap } from 'rxjs';
import { OwnerActiveQuery } from './owner-active-state/owner-active.query';
import { OwnerActiveStore } from './owner-active-state/owner-active.store';
import { OwnerInactiveQuery } from './owner-inactive-state/owner-inactive.query';
import { OwnerInactiveStore } from './owner-inactive-state/owner-inactive.store';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';

@Injectable({
    providedIn: 'root',
})
export class OwnerTService {
    constructor(
        private ownerService: OwnerService,
        private tableService: TruckassistTableService,
        private ownerActiveStore: OwnerActiveStore,
        private ownerInactiveStore: OwnerInactiveStore,
        private ownerActiveQuery: OwnerActiveQuery,
        private ownerInactiveQuery: OwnerInactiveQuery
    ) {}

    // Add Owner
    public addOwner(data: any): Observable<CreateResponse> {
        return this.ownerService.apiOwnerPost(data).pipe(
            tap((res: any) => {
                const subOwner = this.getOwnerById(res.id).subscribe({
                    next: (owner: OwnerResponse | any) => {
                        this.ownerInactiveStore.add(owner);

                        const ownerCount = JSON.parse(
                            localStorage.getItem('ownerTableCount')
                        );

                        ownerCount.inactive++;

                        localStorage.setItem(
                            'ownerTableCount',
                            JSON.stringify({
                                active: ownerCount.active,
                                inactive: ownerCount.inactive,
                            })
                        );

                        this.tableService.sendActionAnimation({
                            animation: 'add',
                            data: owner,
                            id: owner.id,
                        });

                        subOwner.unsubscribe();
                    },
                });
            })
        );
    }

    // Update Owner
    public updateOwner(data: any): Observable<any> {
        return this.ownerService.apiOwnerPut(data).pipe(
            tap(() => {
                const subOwner = this.getOwnerById(data.id).subscribe({
                    next: (owner: OwnerResponse | any) => {
                        if (!owner.truckCount && !owner.trailerCount) {
                            this.ownerInactiveStore.remove(
                                ({ id }) => id === data.id
                            );

                            this.ownerInactiveStore.add(owner);
                        } else {
                            this.ownerActiveStore.remove(
                                ({ id }) => id === data.id
                            );

                            this.ownerActiveStore.add(owner);
                        }

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            tab:
                                !owner.truckCount && !owner.trailerCount
                                    ? 'inactive'
                                    : 'active',
                            data: owner,
                            id: owner.id,
                        });

                        subOwner.unsubscribe();
                    },
                });
            })
        );
    }

    // Get Owner List
    public getOwner(
        active?: number,
        companyOwnerId?: number,
        long?: number,
        lat?: number,
        distance?: number,
        truckTypeIds?: Array<number>,
        trailerTypeIds?: Array<number>,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<GetOwnerListResponse> {
        return this.ownerService.apiOwnerListGet(
            active,
            companyOwnerId,
            long,
            lat,
            distance,
            truckTypeIds,
            trailerTypeIds,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
        );
    }

    // Get Owner By Id
    public getOwnerById(id: number): Observable<OwnerResponse> {
        return this.ownerService.apiOwnerIdGet(id);
    }

    // Get Owner Dropdowns
    public getOwnerDropdowns(): Observable<OwnerModalResponse> {
        return this.ownerService.apiOwnerModalGet();
    }

    // Delete Owner List
    public deleteOwnerList(
        ownersToDelete: any[],
        selectedTab: string
    ): Observable<any> {
        let deleteOnBack = ownersToDelete.map((owner: any) => {
            return owner.id;
        });

        return this.ownerService.apiOwnerListDelete(deleteOnBack).pipe(
            tap(() => {
                let storeOwners =
                    selectedTab === 'active'
                        ? this.ownerActiveQuery.getAll()
                        : this.ownerInactiveQuery.getAll();

                storeOwners.map((owner: any) => {
                    deleteOnBack.map((d) => {
                        if (d === owner.id) {
                            selectedTab === 'active'
                                ? this.ownerActiveStore.remove(
                                      ({ id }) => id === owner.id
                                  )
                                : this.ownerInactiveStore.remove(
                                      ({ id }) => id === owner.id
                                  );
                        }
                    });
                });

                const ownerCount = JSON.parse(
                    localStorage.getItem('ownerTableCount')
                );

                localStorage.setItem(
                    'ownerTableCount',
                    JSON.stringify({
                        active:
                            selectedTab === 'active'
                                ? storeOwners.length - ownersToDelete.length
                                : ownerCount.active,
                        inactive:
                            selectedTab === 'inactive'
                                ? storeOwners.length - ownersToDelete.length
                                : ownerCount.inactive,
                    })
                );
            })
        );
    }

    // Delete Owner By Id
    public deleteOwnerById(
        ownerId: number,
        tableSelectedTab?: string
    ): Observable<any> {
        return this.ownerService.apiOwnerIdDelete(ownerId).pipe(
            tap(() => {
                const ownerCount = JSON.parse(
                    localStorage.getItem('ownerTableCount')
                );

                if (tableSelectedTab === 'active') {
                    this.ownerActiveStore.remove(({ id }) => id === ownerId);

                    ownerCount.active--;
                } else if (tableSelectedTab === 'inactive') {
                    this.ownerInactiveStore.remove(({ id }) => id === ownerId);

                    ownerCount.inactive--;
                }

                localStorage.setItem(
                    'ownerTableCount',
                    JSON.stringify({
                        active: ownerCount.active,
                        inactive: ownerCount.inactive,
                    })
                );

                this.tableService.sendActionAnimation({
                    animation: 'delete',
                    tab: tableSelectedTab,
                    id: ownerId,
                });
            })
        );
    }
}
